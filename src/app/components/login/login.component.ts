import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  apiKey: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private ai: AiService) {
    
  }
  
   onSave = async() => {
    if(!this.apiKey) {
      return;
    }
    
    this.ai.updateApiKey(this.apiKey);
    await this.ai.aiModelList();

    if(this.ai.allModels().length <= 0) {
      return;
    }

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.router.navigate([returnUrl]);
  }
}
