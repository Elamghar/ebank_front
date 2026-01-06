import { ChatService } from '@/services/chat.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  template: `
    <input [(ngModel)]="message" placeholder="Entrez un intent" />
    <button (click)="send()">Envoyer</button>
    <pre>{{ response | json }}</pre>
  `
})
export class ChatComponent {
  message = '';
  response: any;

  constructor(private chatService: ChatService) {}

  send() {
    this.chatService.askBankBot(this.message).subscribe({
      next: res => this.response = res,
      error: err => this.response = err.error
    });
  }
}
