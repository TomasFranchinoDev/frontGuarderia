export interface Transaction {
  id: string;
  amount_paid: number;
  payment_date: string;
  method: string;
}

export interface Charge {
  id: string;
  total_amount: number;
  month_period: string;
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  transactions: Transaction[];
}

export interface PrepaymentOption {
  months: number;
  total_amount: number;
  savings: number;
}

export interface ClientData {
  id: string;
  name: string;
  phone: string;
  box_number: number;
  status: string;
  is_active: boolean;
  credit_balance: number;
  current_debt: number;
  has_discount_current_month: boolean;
  prepayment_options: PrepaymentOption[];
  charges: Charge[];
}