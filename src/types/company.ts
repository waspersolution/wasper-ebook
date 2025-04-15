
export interface Branch {
  id: string;
  name: string;
  address: string | null;
  is_main_branch?: boolean;
}

export interface Company {
  id: string;
  name: string;
  financial_year_start: string | null;
  book_start_date: string | null;
  isDefault?: boolean;
  role?: string;
  has_branches?: boolean;
}
