export interface AccountDetails {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPages:           number;
  pageSize:             number;
  accountOperationDTOS: AccountOperation[];
}

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          string;
  description:   string;
}
// src/app/models/bank-account.model.ts

export interface BankAccount {
  id: string;
  accountNumber: string;
  iban: string;
  balance: number;
  currency: string;
  type: 'CURRENT' | 'SAVINGS' | string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | string;
  createdAt: Date;
  updatedAt?: Date;
  ownerEmail: string; 
}

