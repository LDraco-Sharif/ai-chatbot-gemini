import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AiService } from './services/ai.service';

export const checkTokenGuard: CanActivateFn = (route, state) => {
  let aiService = inject(AiService);
  const router = inject(Router);
  if(aiService.getApiKey()) {
    console.log(aiService.getApiKey());
    return true;
  } else {
    return router.createUrlTree(['/login'], { 
      queryParams: { returnUrl: state.url } 
    }); 
  }
};
