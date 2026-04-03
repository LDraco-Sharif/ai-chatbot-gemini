import { Routes } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { GrammarsComponent } from './components/grammars/grammars.component';
import { checkTokenGuard } from './check-token.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        title: 'Chatbot',
        path: 'chatbot',
        component: ChatbotComponent,
        canActivate: [checkTokenGuard]
    },
    {
        title: 'Grammar',
        path: '',
        component: GrammarsComponent,
        canActivate: [checkTokenGuard]
    },
    {
        title: 'Login',
        path: 'login',
        component: LoginComponent
    }
];
