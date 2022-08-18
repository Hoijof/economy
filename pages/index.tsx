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
import AddIcon from '@mui/icons-material/Add';

// @ts-ignore
import DeleteIcon from '@mui/icons-material/Delete';

import useDb from '../hooks/useDb';
import useTranslation from '../hooks/useTranslation';

export default function Home() {
  const db = useDb('economy');
  const [t] = useTranslation();

  const [expenses, setExpenses] = React.useState([]);

  React.useEffect(() => {
    if (db) {
      setExpenses(db.get('expenses') as Expense[]);
    }
  }, [db]);

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

  const deleteExpense = useCallback(
    (id: number) => {
      if (!db) {
        return;
      }

      db.delete('expenses', id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    },
    [db, expenses],
  );

  return (
    <>
      <Head>
        <meta name="description" content="General summary of Economy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container item>
        <Grid item xs={10} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1">Expenses</Typography>
        </Grid>
        <Grid item xs={2} sx={{ textAlign: 'right' }}>
          <Link href="/expenses">
            <AddIcon sx={{ fontSize: 35, cursor: 'pointer' }} />
          </Link>
        </Grid>
      </Grid>

      <Grid container item direction="column">
        {expenses.map(({ id, quantity, type, date, tags }) => (
          <Link href={`/expenses/${id}`} key={id}>
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
                        deleteExpense(id);
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
