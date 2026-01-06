// models/customer.model.ts
export interface BankAccount {
  id: string;
  balance: number;
  createdAt: Date;
  currency: string;
  status: string;
  type: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  stripeCustomerId: string;
  bankAccounts: BankAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerUpdateRequest {
  name: string;
  email: string;
}

export interface ModifyCustomerRequest {
  name: string;
  email: string;
  passwd?: string;
  balance?: number;
  phone?: string;
  address?: string;
  dateInsc?: string;  // LocalDate serialized as ISO string
  iban?: string;
  roles?: string[];
  cin?: string;
}



