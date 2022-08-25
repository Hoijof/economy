import createDb from '../utils/db';
import { getExpenseGroupMonthByYearAndMonth } from './expenseGroupService';

export function addExpense(expense) {
  const db = createDb('economy');

  const expenseMonth = expense.date.getMonth();
  const expenseYear = expense.date.getFullYear();

  const identifier = getExpensesCollectionName(expenseMonth, expenseYear);

  const expensesDb = createDb(identifier);

  if (!expensesDb.get('stats').length) {
    initializeExpensesGroup(expensesDb);
  }

  expensesDb.add('expenses', expense);

  expensesDb.update('expenses', expense.id, {
    hash: getExpenseHash(expense),
  });

  updateStats(expensesDb, expense);
}

export function getThisMonthExpenses() {
  return getExpensesByMonth(new Date().getMonth());
}

export function getExpensesByMonth(month) {
  return getExpenses(month, new Date().getFullYear());
}

export function getExpenses(month, year) {
  const expensesDb = createDb(getExpensesCollectionName(month, year));

  return expensesDb.get('expenses');
}

// 2022-02-234  => year: 2022, month: 2, id: 234
export function getExpenseByHash(expenseHash) {
  const [year, month, id] = expenseHash.split('-');
  const expensesDb = createDb(getExpensesCollectionName(month, year));

  return expensesDb.get('expenses', parseInt(id));
}

export function getExpenseHash({
  date,
  id,
}: {
  date: Date | string;
  id: number;
}) {
  let cDate = date as Date;

  if (!cDate.getMonth) {
    cDate = new Date(date);
  }

  return `${cDate.getFullYear()}-${cDate.getMonth()}-${id}`;
}

export function updateExpense(expenseHash, expenseUpdate) {
  const [year, month, id] = expenseHash.split('-');

  const expensesDb = createDb(getExpensesCollectionName(month, year));

  const oldExpense = expensesDb.get('expenses', parseInt(id));

  expensesDb.update('expenses', parseInt(id), expenseUpdate);

  updateStatsModification(expensesDb, oldExpense, expenseUpdate);
}

export function deleteExpense(expenseHash) {
  const [year, month, id] = expenseHash.split('-');

  const expensesDb = createDb(getExpensesCollectionName(month, year));

  const oldExpense = expensesDb.get('expenses', parseInt(id));

  updateStatsDeletion(expensesDb, oldExpense);

  expensesDb.delete('expenses', parseInt(id));
}

function getExpensesCollectionName(month, year) {
  return `expenses_${month}_${year}`;
}

function initializeExpensesGroup(expensesDb) {
  expensesDb.add('stats', {
    totalExpended: 0,
  });
}

function updateStats(expensesDb, expense) {
  const stats = expensesDb.get('stats')[0];

  expensesDb.update('stats', stats.id, {
    totalExpended: (stats.totalExpended += expense.quantity),
  });
}

function updateStatsModification(expensesDb, oldExpense, newExpense) {
  if (!newExpense.quantity) {
    return;
  }

  const stats = expensesDb.get('stats')[0];

  expensesDb.update('stats', stats.id, {
    totalExpended: (stats.totalExpended -=
      oldExpense.quantity - newExpense.quantity),
  });
}

function updateStatsDeletion(expensesDb, expense) {
  const stats = expensesDb.get('stats')[0];

  expensesDb.update('stats', stats.id, {
    totalExpended: (stats.totalExpended -= expense.quantity),
  });
}
