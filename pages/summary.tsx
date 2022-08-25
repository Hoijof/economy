import React from 'react';

import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // @ts-ignore
} from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import useDb from './../hooks/useDb';
import { useEffect } from 'react';
import useTranslation from '../hooks/useTranslation';
import { getExpensesByMonth } from '../services/expenseService';

export default function Summary() {
  const db = useDb('economy');
  const [t] = useTranslation();

  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth(),
  );
  const [expenses, setExpenses] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [expensesByType, setExpensesByType] = React.useState({});
  const [typeIdToName, setTypeIdToName] = React.useState({});

  useEffect(() => {
    if (db) {
      const expenses: Expense[] = getExpensesByMonth(selectedMonth);

      const types = db.get('expenseTypes');

      setExpenses(expenses);

      let total = 0;
      const expensesByType = {};

      expenses.forEach((expense) => {
        total += expense.quantity;

        if (!expensesByType[expense.type]) {
          expensesByType[expense.type] = 0;
        }

        expensesByType[expense.type] += expense.quantity;
      });

      const typeIdToName = {};
      types.forEach((type) => {
        typeIdToName[type.id] = type.translation
          ? t[type.translation]
          : type.name;
      });

      setTotal(total);
      setExpensesByType(expensesByType);
      setTypeIdToName(typeIdToName);
    }
  }, [db, selectedMonth, t]);

  const thisMonth = new Date().getMonth();

  const handleChange = (event) => {
    setSelectedMonth(event.target.value as number);
  };

  return (
    <>
      <Grid container item>
        <Grid item>
          <Typography variant="h5" sx={{ textAlign: 'center', pb: 3 }}>
            Total: {total}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl fullWidth>
            <InputLabel id="selectedMonthLabel">Age</InputLabel>
            <Select
              labelId="selectedMonthLabel"
              id="selectedMonth"
              value={selectedMonth}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={thisMonth - 2}>Two months ago</MenuItem>
              <MenuItem value={thisMonth - 1}>Past Month</MenuItem>
              <MenuItem value={thisMonth}>This Month</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item sx={{ width: '100%' }}>
        <TableContainer component={Paper}>
          <Table aria-label="Summary table">
            <TableHead>
              <TableRow>
                <TableCell>{t['addExpenseType']}</TableCell>
                <TableCell>{t['addExpenseAmount']}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(expensesByType).map((type) => (
                <TableRow
                  key={typeIdToName[type]}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {typeIdToName[type]}
                  </TableCell>
                  <TableCell>{expensesByType[type]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
