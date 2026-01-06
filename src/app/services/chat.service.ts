import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'; // ou son chemin exact
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  askBankBot(userMessage: string): Observable<any> {
  const token = this.auth.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  // Exemple simplifié du body Dialogflow attendu par ton FastAPI
  const body = {
    queryResult: {
      intent: {
        displayName: userMessage // ici tu simules l'intent pour test
      }
    }
  };

  return this.http.post(
    'https://0.0.0.0:8000/webhook',
    body,
    { headers }
  );
}

}