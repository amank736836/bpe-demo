export type Vocab = { [token: string]: number };
export type InvVocab = { [id: number]: string };

const SPECIAL_TOKENS = ["<PAD>", "<UNK>", "<BOS>", "<EOS>"];

export class Tokenizer {
  vocab: Vocab = {};
  invVocab: InvVocab = {};

  constructor() {}

  learnVocab(text: string, vocabSize: number = 1000) {
    const words = text.split(/\s+/);
    const freq: { [word: string]: number } = {};
    for (const w of words) {
      freq[w] = (freq[w] || 0) + 1;
    }
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([w]) => w);
    let idx = 0;
    for (const tok of SPECIAL_TOKENS) {
      this.vocab[tok] = idx;
      this.invVocab[idx] = tok;
      idx++;
    }
    for (const w of sorted.slice(0, vocabSize - SPECIAL_TOKENS.length)) {
      if (!this.vocab[w]) {
        this.vocab[w] = idx;
        this.invVocab[idx] = w;
        idx++;
      }
    }
  }

  encode(text: string): number[] {
    const words = text.split(/\s+/);
    const tokens: number[] = [this.vocab["<BOS>"]];
    for (const w of words) {
      if (this.vocab[w]) {
        tokens.push(this.vocab[w]);
      } else {
        tokens.push(this.vocab["<UNK>"]);
      }
    }
    tokens.push(this.vocab["<EOS>"]);
    return tokens;
  }

  decode(tokens: number[]): string {
    const words: string[] = [];
    for (const t of tokens) {
      const w = this.invVocab[t] || "<UNK>";
      if (!SPECIAL_TOKENS.includes(w)) {
        words.push(w);
      }
    }
    return words.join(" ");
  }
}
