export interface Balance {
  totalCoin: number;
  totalCoinMore: number;
  totalCoinUse: number;
}

export interface LoginData {
  phone: string;
  pass: string;
  code?: string;
}