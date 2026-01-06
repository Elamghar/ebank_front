import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export interface TransactionRequest {
    senderaccountId:string;
    receiveraccountId:string;
  // cardType: string;
  amount: number;
  description: string;
}

export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  description: string;
  type: string;
  bankAccount?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TransfersService {
  private apiUrl = 'http://localhost:8085';

  constructor(private http: HttpClient, private auth: AuthService) {}

  SubmitTransaction(o: TransactionRequest): Observable<any> {
    console.log("submit request: "+o.receiveraccountId,o.senderaccountId,o.amount,o.description);
    return this.http.post<any>(`${this.apiUrl}/api/transfer`, o);
  }

  getHistory(): Observable<AccountOperation[]> {
    const username = this.auth.getUsername();
    return this.http.get<AccountOperation[]>(`${this.apiUrl}/history/${username}`);
  }
}
