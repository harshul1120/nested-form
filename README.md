# Nested Form Builder

A React application for building dynamic questionnaires with recursive True/False branching.

---

## Features

- Add parent questions dynamically using the **Add Question** button
- Support for two question types:
  - Short Answer
  - True/False
- Recursive nesting support:
  - Selecting **True** reveals sub-questions
  - Unlimited nesting depth supported
- Automatic hierarchical numbering:
  - Q1
  - Q1.1
  - Q1.1.1
  - Q2
- Delete any question along with its child questions
- Form submission and review summary
- Local storage persistence
- Drag-and-drop reordering for parent questions

---

## Prerequisites

Before running the project, make sure you have:

- Node.js v16 or higher
- npm v8 or higher

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/nested-form-builder.git
```

Go to the project directory:

```bash
cd nested-form-builder
```

Install dependencies:

```bash
npm install
```

---

## Run the Project

Start the development server:

```bash
$env:PORT=5173; npm start
```

---

## Production Build

To create a production build:

```bash
npm run build
```

The optimized files will be generated inside the `build/` folder.

---

## Project Structure

```text
src/
├── App.js
├── QuestionNode.js
├── index.js
└── index.css

public/
└── index.html
```

### File Description

| File | Description |
|------|-------------|
| `App.js` | Main application component handling state, localStorage, drag-and-drop, and submission |
| `QuestionNode.js` | Recursive component for rendering questions and nested child questions |
| `index.js` | React DOM entry point |
| `index.css` | Application styling |
| `index.html` | Main HTML template |

---

## Key Design Decisions

| Decision | Purpose |
|----------|---------|
| Recursive `QuestionNode` component | Handles unlimited nesting cleanly |
| Child questions stored inside parent objects | Simplifies update and delete operations |
| localStorage auto-save | Prevents accidental data loss |
| Native HTML5 drag-and-drop | Avoids unnecessary external libraries |
| Conditional rendering for sub-questions | Child questions appear only when True is selected |

---

## How to Use

1. Click **Add Question** to create a new question.
2. Enter the question text.
3. Select a question type.
4. If **True/False** is selected:
   - Choose True or False
   - Selecting True reveals nested sub-questions
5. Add unlimited nested questions if needed.
6. Use the **Delete** button to remove a question and all its descendants.
7. Drag questions using the handle to reorder parent questions.
8. Click **Submit & Review** to view all questions in hierarchical order.
9. The form is automatically saved in local storage.

---

## Technologies Used

- React.js
- JavaScript (ES6)
- HTML5
- CSS3
- Local Storage API

---

## Future Improvements

- Edit mode for submitted forms
- Export form as JSON
- Backend/database integration
- Authentication support
- Improved drag-and-drop for nested questions

---

## Author

Developed by Harshul Gupta
