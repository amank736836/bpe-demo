This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Custom Tokenizer Demo

This project demonstrates a simple custom tokenizer that learns vocabulary from a text corpus, supports ENCODE/DECODE, and handles special tokens.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Place your corpus in `demo_corpus.txt` (already provided).

## Usage

### Learn Vocabulary

```ts
import { Tokenizer } from "./src/tokenizer";
import fs from "fs";

const corpus = fs.readFileSync("demo_corpus.txt", "utf-8");
const tokenizer = new Tokenizer();
tokenizer.learnVocab(corpus, 100); // Learn vocab of size 100
tokenizer.saveVocab("vocab.json");
```

### Encode/Decode

```ts
// Load vocab
const tokenizer = new Tokenizer();
tokenizer.loadVocab("vocab.json");

const text = "your text here";
const tokens = tokenizer.encode(text);
const decoded = tokenizer.decode(tokens);
console.log(tokens, decoded);
```

## Special Tokens

- `<PAD>`: Padding
- `<UNK>`: Unknown
- `<BOS>`: Beginning of sequence
- `<EOS>`: End of sequence

## Example

```
Input: Hello world
Encode: [2, 5, 6, 3] // (BOS, Hello, world, EOS)
Decode: Hello world
```

## Performance

- Fast vocab learning and encoding/decoding for small corpora.

## Files

- `src/tokenizer.ts`: Tokenizer implementation
- `demo_corpus.txt`: Demo corpus
- `vocab.json`: Saved vocabulary

---

Feel free to extend for BPE or other algorithms!

# Developer Review & Feedback

If you enjoyed using this custom tokenizer demo or found it helpful, please consider leaving a review or feedback for the developer!

## How to Give Feedback

- **Star the repository** if you liked the project.
- **Open an issue** for bugs, suggestions, or feature requests.
- **Share your experience** or improvements via pull requests.
- **Contact the developer** directly for collaboration or questions.

## Why Give Feedback?

- Helps improve the project for everyone.
- Motivates the developer to add new features and maintain the code.
- Builds a stronger open-source community.

---

Thank you for trying out the tokenizer demo!
