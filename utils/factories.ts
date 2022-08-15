export function createExpense(quantity, type, date, tags): Expense {
    return {
        quantity,
        type,
        date,
        tags,
    };
}
