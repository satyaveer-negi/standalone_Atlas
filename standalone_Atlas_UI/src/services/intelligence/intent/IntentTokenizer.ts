export class IntentTokenizer {
  public tokenize(prompt: string): string[] {
    return prompt
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/);
  }
}

export const activeIntentTokenizer = new IntentTokenizer();
