import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { GenerateContentResponse } from '@google/genai';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit{

  chats: Chat[] = [];


  message: string = '';

  constructor(private ai: AiService) {
  
  }

  async ngOnInit() {
  }

  async onButtonClick() {
    let userMessage: Chat = {
      role: 'user',
      message: this.message
    }

    let history = this.chatToHistory();
    let result =  await this.ai.getResponse(this.message, true, history);

    if(!result) {
      console.log("ERROR IN CHAT");
    } else if (!(result instanceof GenerateContentResponse) ) {

      let aiMessage: Chat = {
        role: 'model',
        message: ''
      }
      this.chats.push(userMessage,aiMessage);

      for await(const chunk of result) {
        aiMessage.message += chunk.text ?? '';
      }
      this.message = '';
    }

  }

  chatToHistory() {
    return this.chats.map(({role, message}) => {
      let result = {
        role,
        parts: [{ text: message }]
      };

      return result;
    })
  }
}

interface Chat {
  role: 'user' | 'model',
  message: string
}