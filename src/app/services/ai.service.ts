import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Content, GoogleGenAI , HarmBlockThreshold, HarmCategory, Model } from '@google/genai';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { async } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  platformId = inject(PLATFORM_ID);
  apiKey = this.getApiKey();
  modelValue = "";

  allModels = signal<Model[]>([]);

  filteredModels = computed(() => {
    return this.allModels().filter(m => {
      const name = m.name?.toLowerCase();
       const isGemini = name?.includes('gemini');
       const supportsGeneration = m.supportedActions?.includes('generateContent');
      return isGemini && supportsGeneration;
    });
  })

  genAI?: GoogleGenAI ;

  constructor() {
    if(!this.apiKey) {
      return;
    }
    
    this.aiModelList();
  }

  getApiKey() {
    if(environment.API_KEY) {
      return environment.API_KEY;
    }
    if (true || isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('apiKey') ?? '';
    }

    return '';
  }

  updateApiKey(apiKey: string) {
    if (true || isPlatformBrowser(this.platformId)) {
      this.apiKey = apiKey;
      localStorage.setItem("apiKey", apiKey);
      this.genAI = new GoogleGenAI ({ apiKey: this.apiKey});
    }
  }

  async aiModelList() {
    try {
      let response = await this.genAI?.models.list();
  
      this.allModels.set(response?.page ?? []);
  
      this.modelValue = this.filteredModels()[0]?.name ?? '';
    } catch (e) {
      console.log("API key might be invalid.");
      this.updateApiKey("");
    }
  }

  safetySettings = [{
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.OFF,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  }
  ];

  async getResponse(prompt: string, inStream: boolean = false, history: Content[] = []) {
    if(this.modelValue) {
      let generateContentType : 'generateContent' | 'generateContentStream' = 'generateContent';
      if (inStream) {
        generateContentType = 'generateContentStream';
      }
      let result = await this.genAI?.models[generateContentType]({
        model: this.modelValue,
        contents:  [...history, { role: 'user', parts: [{ text: prompt }] }],
        config: {
          tools: [{
            googleSearch: {}
          },
          {
            googleMaps: {}
          }
        ],
          safetySettings: this.safetySettings
        }
      });

      return result;
    } else {
      return null;
    }
  }
}
