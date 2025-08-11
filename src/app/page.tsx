'use client';

import { useState } from "react";
import { Tokenizer } from '../tokenizer';

const SPECIAL_TOKENS = ["<PAD>", "<UNK>", "<BOS>", "<EOS>"];
const ALPHABETS = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i));

class BPETokenizer {
  private vocab: Record<string, number>;
  private invVocab: Record<number, string>;
  private merges: string[][];

  constructor() {
    this.vocab = {};
    this.invVocab = {};
    this.merges = [];
  }

  initVocab() {
    let index = 0;
    SPECIAL_TOKENS.forEach((tok) => {
      this.vocab[tok] = index++;
    });
    ALPHABETS.forEach((char) => {
      if (!this.vocab[char]) {
        this.vocab[char] = index++;
      }
    });
  }

  train(corpus: string, vocabSize = 60) {
    this.initVocab();
    const words = corpus
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => [...w]);

    let tokenized = words.map((w) => [...w, "</w>"]);
    tokenized.forEach((w) =>
      w.forEach((char) => {
        if (!this.vocab[char]) {
          this.vocab[char] = Object.keys(this.vocab).length;
        }
      })
    );

    while (Object.keys(this.vocab).length < vocabSize) {
      const pairs: Record<string, number> = {};
      tokenized.forEach((word) => {
        for (let i = 0; i < word.length - 1; i++) {
          const pair = `${word[i]} ${word[i + 1]}`;
          pairs[pair] = (pairs[pair] || 0) + 1;
        }
      });

      if (!Object.keys(pairs).length) break;

      const bestPair = Object.entries(pairs).sort((a, b) => b[1] - a[1])[0][0];
      const [a, b] = bestPair.split(" ");
      const newToken = a + b;
      this.vocab[newToken] = Object.keys(this.vocab).length;
      this.merges.push([a, b]);

      tokenized = tokenized.map((word) => {
        const merged = [];
        let skip = false;
        for (let i = 0; i < word.length; i++) {
          if (!skip && i < word.length - 1 && word[i] === a && word[i + 1] === b) {
            merged.push(newToken);
            skip = true;
          } else {
            if (skip) {
              skip = false;
            } else {
              merged.push(word[i]);
            }
          }
        }
        return merged;
      });
    }
    this.invVocab = Object.fromEntries(
      Object.entries(this.vocab).map(([k, v]) => [v, k])
    );
  }

  encode(text: string) {
    const words = text.split(/\s+/).map((w) => [...w, "</w>"]);
    const tokens = [];
    tokens.push(this.vocab["<BOS>"]);

    words.forEach((word) => {
      let current = [...word];
      for (const [a, b] of this.merges) {
        const newWord = [];
        let skip = false;
        for (let i = 0; i < current.length; i++) {
          if (!skip && i < current.length - 1 && current[i] === a && current[i + 1] === b) {
            newWord.push(a + b);
            skip = true;
          } else {
            if (skip) {
              skip = false;
            } else {
              newWord.push(current[i]);
            }
          }
        }
        current = newWord;
      }
      current.forEach((t) => {
        tokens.push(this.vocab[t] ?? this.vocab["<UNK>"]);
      });
    });

    tokens.push(this.vocab["<EOS>"]);
    return tokens;
  }

  decode(tokenIds: number[]) {
    const tokens = tokenIds
      .map((id) => this.invVocab[id] ?? "<UNK>");
    let result = "";
    for (let t of tokens) {
      if (SPECIAL_TOKENS.includes(t)) continue;
      if (t === "</w>") {
        result += " ";
      } else {
        result += t;
      }
    }
    return result.trim();
  }
}

import { useEffect } from "react";

export default function Home() {
  const demoCorpus = "Hello world from tokenizer demo corpus";
  const [corpus, setCorpus] = useState(demoCorpus);
  const [input, setInput] = useState("");
  const [encoded, setEncoded] = useState<number[]>([]);
  const [decoded, setDecoded] = useState("");
  const [tokenizer, setTokenizer] = useState<BPETokenizer | null>(null);
  const [darkMode] = useState(false);

  useEffect(() => {
    const tok = new BPETokenizer();
    tok.train(corpus, 60);
    setTokenizer(tok);
  }, [corpus]);

  const trainTokenizer = () => {
    const tok = new BPETokenizer();
    tok.train(corpus, 60);
    setTokenizer(tok);
    alert("Tokenizer trained!");
  };

  const handleEncode = () => {
    if (!tokenizer) return alert("Train the tokenizer first!");
    const ids = tokenizer.encode(input);
    setEncoded(ids);
    setDecoded(tokenizer.decode(ids));
  };

  const demoTokenizer = new Tokenizer();
  demoTokenizer.learnVocab(demoCorpus, 50);
  const sample = 'Hello world from tokenizer';
  const demoTokens = demoTokenizer.encode(sample);
  const demoDecoded = demoTokenizer.decode(demoTokens);

  return (
    <div className={`tokenizer-container${darkMode ? ' dark' : ''}`}>
      <div className="tokenizer-card glass">
        <div className="tokenizer-header">
          <h1>Custom BPE Tokenizer <span className="tokenizer-subtitle">(Next.js)</span></h1>
        </div>
        <section>
          <h2>1. Train Tokenizer</h2>
          <textarea
            rows={6}
            cols={60}
            value={corpus}
            onChange={(e) => setCorpus(e.target.value)}
            placeholder="Paste your training corpus here"
            className="tokenizer-textarea"
          />
          <br />
          <button className="tokenizer-btn" onClick={trainTokenizer}>Train Tokenizer</button>
        </section>
        <section>
          <h2>2. Encode/Decode</h2>
          <div className="tokenizer-encode-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="The quick brown fox jumps over the lazy dog! @2025"
              className="tokenizer-input"
            />
            <button className="tokenizer-btn" onClick={handleEncode}>Encode</button>
            <button className="tokenizer-btn tokenizer-example-btn"
              onClick={() => setInput('The quick brown fox jumps over the lazy dog! @2025')}
            >Fill Example</button>
          </div>
          <div className="tokenizer-example-hint">
            <b>Example:</b> <span className="tokenizer-example-italic">{'The quick brown fox jumps over the lazy dog! @2025'}</span>
          </div>
          <div className="tokenizer-result">
            <h3>Encoded IDs:</h3>
            <pre className="tokenizer-ids-pre">{encoded.join(' ')}</pre>
            <h3>Decoded Text:</h3>
            <pre>{decoded}</pre>
          </div>
        </section>
        <section className="tokenizer-demo">
          <h2>Demo</h2>
          <div className="tokenizer-demo-grid">
            <div><b>Input:</b></div><div>{sample}</div>
            <div><b>Tokens:</b></div><div>[{demoTokens.join(', ')}]</div>
            <div><b>Decoded:</b></div><div>{demoDecoded}</div>
            <div><b>Vocab size:</b></div><div>{Object.keys(demoTokenizer.vocab).length}</div>
            <div><b>Special tokens:</b></div><div>{'<PAD>, <UNK>, <BOS>, <EOS>'}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
