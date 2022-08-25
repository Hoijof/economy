import React, { useCallback } from 'react';
// @ts-ignore
import Head from 'next/head';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import dayjs from 'dayjs';
import {
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
  // @ts-ignore
} from '@mui/material';

// @ts-ignore
import DeleteIcon from '@mui/icons-material/Delete';

import useDb from '../hooks/useDb';
import useTranslation from '../hooks/useTranslation';
import {
  deleteExpense,
  getExpenseHash,
  getThisMonthExpenses,
} from '../services/expenseService';

export default function Home() {
  const db = useDb('economy');
  const [t] = useTranslation();

  const [expenses, setExpenses] = React.useState([]);

  React.useEffect(() => {
    setExpenses(getThisMonthExpenses());
  }, []);

  const getTypeName = useCallback(
    (typeId: number) => {
      if (!db) {
        return;
      }

      const { name, translation } = db.get('expenseTypes', typeId);

      return translation ? t[translation] : name;
    },
    [db, t],
  );

  const handleDeleteExpense = useCallback(
    (hash: string) => {
      if (!hash) {
        return;
      }

      deleteExpense(hash);

      setExpenses(expenses.filter((expense) => expense.id !== hash));
    },
    [expenses],
  );

  return (
    <>
      <Head>
        <meta name="description" content="General summary of Economy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid item>
        <Link href="/summary">
          <Typography variant="h4">{t['summary']}</Typography>
        </Link>
      </Grid>
      <Grid container item direction="column">
        {expenses.map(({ id, quantity, type, date, tags, hash }) => (
          <Link href={`/expenses/${getExpenseHash({ date, id })}`} key={id}>
            <Card key={id} sx={{ margin: 2, cursor: 'pointer' }}>
              <CardContent>
                <Grid container direction="row">
                  <Grid item xs={2}>
                    <Typography gutterBottom variant="h5" component="div">
                      {quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      {getTypeName(type)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(date).format(t['dateFormat'])}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t['addExpenseTags']}: {tags.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ textAlign: 'right' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        handleDeleteExpense(hash);
                        e.stopPropagation();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Grid>
    </>
  );
}
