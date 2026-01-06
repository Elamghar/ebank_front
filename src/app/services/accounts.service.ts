import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { AccountDetails } from "../model/account.model";
import { ModifyCustomerRequest } from '@/model/customer.model';

// Interfaces pour les types de réponse
export interface AccountsSummary {
  accounts: any[];
  totalAccounts: number;
  accountsByType: { [key: string]: number };
  totalAccountsLastMonth?: number; 
}

export interface AccountsCount {
  totalAccounts: number;
  accountsByType: { [key: string]: number };
}

export interface TransactionStats {
  totalTransactions: number;
  todayTransactions: number;
  yesterdayTransactions: number;
  dailyPercentageChange: number;
  todayVolume: number;
  yesterdayVolume: number;
  volumePercentageChange: number;
  transactionsByType: { [key: string]: number };
}

export interface TransactionSummary {
  transactions: any[];
  stats: TransactionStats;
}
export interface CustomerDTO {
  id: number;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  type: string;
  createdAt: number;
  balance: number;
  status: string;
  interestRate?: number;  
  overdraft?: number;   
  customerDTO: CustomerDTO;
}



@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient) { }

  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${environment.backendHost}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`);
  }


  // Get all accounts
  public getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(environment.backendHost + "/accounts");
  }

  public getAccountsCount(): Observable<AccountsCount> {
    return this.http.get<AccountsCount>(`${environment.backendHost}/accounts/count`);
  }

  public getAccountsSummary(): Observable<AccountsSummary> {
    return this.http.get<AccountsSummary>(`${environment.backendHost}/accounts/summary`);
  }

  public getAllTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.backendHost}/transactions`);
  }

  public getTransactionStats(): Observable<TransactionStats> {
    return this.http.get<TransactionStats>(`${environment.backendHost}/transactions/stats`);
  }

  public getTodayTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.backendHost}/transactions/today`);
  }

  public getTransactionSummary(): Observable<TransactionSummary> {
    return this.http.get<TransactionSummary>(`${environment.backendHost}/transactions/summary`);
  }

  public debit(accountId: string, amount: number, description: string) {
    const data = { accountId, amount, description };
    return this.http.post(`${environment.backendHost}/transactions/debit`, data);
  }

  public credit(accountId: string, amount: number, description: string) {
    const data = { accountId, amount, description };
    return this.http.post(`${environment.backendHost}/transactions/credit`, data);
  }

  public transfer(accountSource: string, accountDestination: string, amount: number, description: string) {
    const data = { accountSource, accountDestination, amount, description };
    return this.http.post(`${environment.backendHost}/transactions/transfer`, data);
  }

  public getAccountsByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.backendHost}/customers/accounts/${username}`);
  }

  public modifyCustomer(request: ModifyCustomerRequest): Observable<any> {
    return this.http.post<any>(`${environment.backendHost}/modify-customer`, request);
  }
}
