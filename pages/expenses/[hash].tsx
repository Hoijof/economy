// @ts-ignore
import { useRouter } from 'next/router';
import ManageExpense from '../../components/ManageExpense';

export default function Expense() {
  const router = useRouter();
  const { hash } = router.query;

  return <ManageExpense expenseHash={hash} />;
}
