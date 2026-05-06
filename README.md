# Nested Form Builder

A React application for building dynamic questionnaires with recursive True/False branching.

## Features

- **Add parent questions** dynamically via "Add Question"
- **Question types**: Short Answer or True/False
- **Recursive nesting**: True/False questions with a "True" answer reveal a sub-question form — which itself can nest further (unlimited depth)
- **Auto-numbering**: hierarchical format — Q1, Q1.1, Q1.1.1, Q2, etc.
- **Delete**: remove any question (and its entire subtree) via the Delete button
- **Form review**: submit to see all questions in a flat hierarchical summary
- **Local storage persistence**: form state is saved automatically — reload the page and your work is preserved
- **Drag-and-drop reordering** of parent questions: grab the ⠿ grip handle and drag

## Setup

### Prerequisites

- Node.js v16 or higher
- npm v8 or higher

### Install

```bash
git clone https://github.com/harshul1120/nested-form.git
cd nested-form-builder
npm install
```

### Run (development)

```bash
$env:PORT=5173; npm start
```
Open in the new browser 

### Build (production)

```bash
npm run build
```

Output is placed in the `build/` directory and can be served by any static file server.

## Project Structure

```
src/
├── App.js           Main component — state, drag-and-drop, localStorage, submission
├── QuestionNode.js  Recursive question component — renders one question + its children
├── index.js         React DOM entry point
└── index.css        All styles
public/
└── index.html       HTML shell
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Recursive `QuestionNode` component | Clean way to handle arbitrary nesting depth without duplicating logic |
| Subtree stored inside each question object | Makes update/delete/reorder simple — each node owns its children |
| localStorage auto-save on every change | Prevents accidental data loss with zero user friction |
| HTML5 drag-and-drop API (no library) | Avoids adding `react-beautiful-dnd` or `dnd-kit` as a dependency for basic reordering |
| Children only visible when tfAnswer === 'true' | Meets spec: sub-questions only revealed after selecting True |

## Usage

1. Click **Add Question** to insert a new question block.
2. Type the question text and choose a type from the dropdown.
3. If you select **True/False**, two radio buttons appear. Selecting **True** expands a child area where you can add sub-questions.
4. Sub-questions follow the same structure and can nest further (unlimited depth).
5. Use the **Delete** button on any question to remove it and all its descendants.
6. Drag the **⠿ handle** on a parent question to reorder it.
7. Click **Submit & Review** to see a flat hierarchical summary of all questions.
8. Your form is automatically saved in `localStorage` — you can close the tab and return to it later.
