export interface ExpenseBody {
  description: string;
  categoryId: string;
  amount: number;
}
export interface GetExpenseBody {
  dateRange:string
}
