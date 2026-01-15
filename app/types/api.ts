export interface Payment {
  id: string;
  amount: number;
  month_period: string;
  status: string; // 'PENDING' | 'PAID'
  method: string | null;
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
  current_debt: number;
  has_discount_current_month: boolean;
  prepayment_options: PrepaymentOption[];
  payments?: Payment[];
}