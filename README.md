# JAVA FULL STACK DAILY v1

An automated daily learning-card generator for a modern Java Full Stack engineer.

Every morning it:

1. asks OpenAI for **one narrow, structured lesson**;
2. renders that lesson into **five deterministic 9:16 cards** using HTML/CSS;
3. saves the five cards as PNGs;
4. updates a swipeable mobile webpage in `docs/`;
5. remembers recent topics to reduce accidental repetition.

There is **no AI image generation**. OpenAI writes the lesson; your code owns the pixels. That means the brand, layout, colours and card structure stay stable from day to day.

## What you get

- `01-hook.png`
- `02-mental-model.png`
- `03-code.png`
- `04-production.png`
- `05-interview.png`
- a mobile-first page that lets you swipe through all five cards
- a scheduled GitHub Actions workflow for `05:30 Europe/London`
- a no-API demo mode for testing the design locally

## Architecture

```text
GitHub Actions (05:30 Europe/London)
        |
        v
OpenAI structured lesson
        |
        v
TypeScript data model
        |
        v
5 fixed HTML/CSS templates
        |
        v
Playwright screenshots (1080 x 1920)
        |
        v
docs/cards/*.png + docs/index.html
        |
        v
GitHub Pages / iPhone
```

## One-time setup

### 1. Create a GitHub repository

Create an empty repository, for example:

`java-full-stack-daily`

Public is simplest for GitHub Pages. Do not put personal/private information in the generated content if you publish it publicly.

### 2. Put this project into the repository

From a terminal in this folder:

```bash
git init
git add .
git commit -m "Initial JAVA FULL STACK DAILY v1"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

### 3. Create an OpenAI API key

Create a dedicated API key for this project in your OpenAI API account.

Do **not** commit the key to the repository.

### 4. Add the key to GitHub Actions

In the repository:

**Settings → Secrets and variables → Actions → New repository secret**

Name:

`OPENAI_API_KEY`

Value:

Your OpenAI API key.

The workflow defaults to `gpt-5.6-terra`. You can change `OPENAI_MODEL` in `.github/workflows/daily.yml` later if wanted.

### 5. Make sure GitHub Actions can write generated files

The workflow includes:

```yaml
permissions:
  contents: write
```

If GitHub blocks the automated commit, go to:

**Settings → Actions → General → Workflow permissions**

and allow **Read and write permissions** where available.

### 6. Test the workflow manually

Go to:

**Actions → Generate daily lesson → Run workflow**

The first run will:

- install Node dependencies;
- install Chromium for Playwright;
- call OpenAI once;
- render five PNGs;
- update `docs/`;
- append the topic to `data/history.json`;
- commit the generated output back to the repository.

Check that these files appear:

```text
docs/cards/01-hook.png
docs/cards/02-mental-model.png
docs/cards/03-code.png
docs/cards/04-production.png
docs/cards/05-interview.png
docs/index.html
```

### 7. Turn on GitHub Pages

In GitHub:

**Settings → Pages**

Under **Build and deployment** choose:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/docs**

Save.

GitHub will show the URL for your site once Pages deploys.

### 8. Put it on your iPhone Home Screen

Open the GitHub Pages URL in Safari.

Then:

**Share → Add to Home Screen**

Name it something like:

`Java Daily`

Each morning, open that icon and swipe through the five cards.

## Daily automation

`.github/workflows/daily.yml` runs at:

**05:30 Europe/London every day**

It runs before 06:00 so the cards have time to generate before you look at them.

No daily copying, pasting or image generation is required.

## Local demo — no API key required

If you have Node.js installed:

```bash
npm install
npx playwright install chromium
npm run demo
```

Then open:

`docs/index.html`

The demo uses a built-in lesson about Spring `@Transactional` self-invocation and does not call OpenAI.

## Local real generation

Set your API key in the shell:

```bash
export OPENAI_API_KEY="..."
```

Optionally choose a model:

```bash
export OPENAI_MODEL="gpt-5.6-terra"
```

Then run:

```bash
npm run generate
```

## Project structure

```text
java-full-stack-daily/
├── .github/
│   └── workflows/
│       └── daily.yml
├── data/
│   └── history.json
├── docs/
│   ├── cards/
│   ├── index.html
│   ├── lesson.json
│   └── .nojekyll
├── src/
│   ├── render/
│   │   ├── common.ts
│   │   ├── styles.ts
│   │   └── templates.ts
│   ├── buildSite.ts
│   ├── demoLesson.ts
│   ├── generateLesson.ts
│   ├── history.ts
│   ├── main.ts
│   ├── prompt.ts
│   ├── renderCards.ts
│   ├── schema.ts
│   ├── time.ts
│   └── types.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Where to customise it

### Curriculum

Edit:

`src/prompt.ts`

### Brand / visual design

Edit:

`src/render/styles.ts`

### Card layouts

Edit:

`src/render/templates.ts`

### Structured data contract

Edit:

`src/schema.ts` and `src/types.ts`

### Generation time

Edit:

`.github/workflows/daily.yml`

## Design principles in v1

The five layouts are intentionally fixed:

1. **Hook** — large topic/token and one strong hook.
2. **Mental model** — two visual flows for the core mechanism/contrast.
3. **See it in code** — IDE-style code window with one highlighted line.
4. **Production reality** — scenario, runtime flow, gotchas and professional approach.
5. **Interview + remember** — interview question, strong answer, three takeaways and tomorrow.

The renderer uses a permanent dark Java-IDE visual language:

- `#1E1E1E` editor background
- `#252B33` panels
- blue for concepts
- green for recommended/correct
- amber for warnings/trade-offs
- purple for interview/remember
- Java-style code highlighting
- `JavaFullStackDaily.java` as the active file identity
- `public final class JavaFullStackDaily { }` as the brand signature

## v1 limitations

- The content is generated from text knowledge only; it does not browse the web each morning.
- GitHub scheduled workflows can occasionally start later than their target time.
- The layouts are intentionally deterministic. v1 favours consistency and readability over AI-generated decorative illustrations.
- GitHub Pages is best treated as public unless you deliberately choose a different hosting approach.

These are deliberate trade-offs for a first version whose main goal is: **wake up, open one page, swipe five cards, learn something useful.**
