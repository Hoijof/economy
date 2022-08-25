import createDb from '../utils/db';

export function getExpenseGroupByYear(year) {
  const db = createDb('economy');

  const expenseGroup = db.get('expenseGroups', 'year', year);

  return expenseGroup;
}

export function getExpenseGroupMonth(expenseGroup, expenseMonth) {
  const month = expenseGroup.months[expenseMonth];

  if (!month) {
    expenseGroup.months[month] = {
      totalExpended: 0,
    };
  }

  return expenseGroup.months[month];
}

export function getExpenseGroupMonthByYearAndMonth(year, month) {
  const expenseGroup = getExpenseGroupByYear(year);

  return getExpenseGroupMonth(expenseGroup, month);
}
