import { Component } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';
import {marked} from "marked";
import markedKatex from "marked-katex-extension";
import { GenerateContentResponse } from '@google/genai';

@Component({
  selector: 'app-grammars',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './grammars.component.html',
  styleUrl: './grammars.component.scss'
})
export class GrammarsComponent {

  inputPrompt: string = "";
  outputPrompt: string = "";

  promptSet: FeatureDictionaries[]  = [
    {
      title: 'Summarize',
      initialPrompt: 'Summarize the following text. Do not write anything other than the answer.\n'
    },
    {
      title: 'Fix Grammar',
      initialPrompt: 'Fix any grammar mistake in the following text. Do not write anything other than the answer. Do bold out the mistakes.\n'
    },
    {
      title: 'Formalize',
      initialPrompt: 'Make the following text more formal. Do not write anything other than the answer.\n'
    }
  ];

  constructor(private ai: AiService) {
    
  }

  async onFunctionalityClick(initialPrompt: string) {
    let result = await this.ai.getResponse(initialPrompt + this.inputPrompt);

    if(result instanceof GenerateContentResponse) {
      marked.use(markedKatex(options));
      this.outputPrompt = await marked.parse(result?.text ?? '');
    }

  }
}

interface FeatureDictionaries {
  title: string,
  initialPrompt: string
};

const options = {
  throwOnError: false
};