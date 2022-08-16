// @ts-ignore
import { useRouter } from 'next/router'
import ManageExpense from '../../components/ManageExpense';

export default function Expense () {
  const router = useRouter();
  const { id } = router.query;

  return <ManageExpense expenseId={parseInt(id)}/>
}