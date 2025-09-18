export interface ExpenseBody {
  description: string;
  categoryId: string;
  amount: number;
  status:string
  createdAt:any
}
export interface GetExpenseBody {
  dateRange:"weekly" | "monthly" | "yearly"
}
