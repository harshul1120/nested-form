import React, { useState, useEffect } from 'react';
import QuestionNode from './QuestionNode';

// localStorage key
const STORAGE_KEY = 'nested_form_v1';

// ── Helpers ────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function createQuestion() {
  return {
  id: generateId(),
  text: '',
  type: 'short',

  shortAnswer: '',

  tfAnswer: null,

  children: [],
};
}

/**
 * Recursively flatten the question tree into a list for the review panel.
 * Returns: [{ num, text, type, tfAnswer }, ...]
 */
function flattenForReview(questions, prefix = '') {
  let result = [];
  questions.forEach((q, i) => {
    const num = prefix ? `${prefix}.${i + 1}` : `Q${i + 1}`;
    result.push({
  num,
  text: q.text || '(no text entered)',
  type: q.type,

  tfAnswer: q.tfAnswer,

  shortAnswer: q.shortAnswer
});
    if (q.children && q.children.length > 0) {
      result = result.concat(flattenForReview(q.children, num));
    }
  });
  return result;
}

// ── App ────────────────────────────────────────────────────────────────────

function App() {
  // Load from localStorage on first render
  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) { /* ignore parse errors */ }
    return [];
  });

  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState('');

  // Drag-and-drop state for parent question reordering
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Auto-save to localStorage whenever questions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (_) { /* quota exceeded — silent fail */ }
  }, [questions]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── CRUD ────────────────────────────────────────────────────────────────

  const addQuestion = () => {
    setQuestions(prev => [...prev, createQuestion()]);
    setSubmitted(false);
  };

  const updateQuestion = (id, updated) => {
    setQuestions(prev => prev.map(q => q.id === id ? updated : q));
    setSubmitted(false);
  };

  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setSubmitted(false);
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all questions? This cannot be undone.')) return;
    setQuestions([]);
    setSubmitted(false);
    localStorage.removeItem(STORAGE_KEY);
    setToast('Form cleared');
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    setSubmitted(true);
    // Scroll to review panel
    setTimeout(() => {
      document.querySelector('.submission-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // ── Drag-and-drop (parent questions only) ───────────────────────────────

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const reordered = [...questions];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setQuestions(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
    setToast('Question reordered');
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const reviewItems = flattenForReview(questions);

  return (
    <div className="app">
      {/* Page header */}
      <div className="header">
        <h1>
          <i className="ti ti-layout-list" aria-hidden="true" />
          Nested Form Builder
        </h1>
        <p>Build dynamic questionnaires with recursive True/False branching · Auto-saved to local storage</p>
      </div>

      {/* Action toolbar */}
      <div className="toolbar">
        <button className="btn btn-primary" onClick={addQuestion}>
          <i className="ti ti-plus" aria-hidden="true" />
          Add Question
        </button>

        {questions.length > 0 && (
          <>
            <button className="btn btn-success" onClick={handleSubmit}>
              <i className="ti ti-check" aria-hidden="true" />
              Submit &amp; Review
            </button>
            <button
              className="btn btn-sm"
              onClick={handleClearAll}
              style={{ marginLeft: 'auto', color: '#A32D2D', borderColor: 'rgba(163,45,45,0.35)' }}
            >
              <i className="ti ti-trash" aria-hidden="true" />
              Clear All
            </button>
          </>
        )}
      </div>

      {/* Question list */}
      {questions.length === 0 ? (
        <div className="empty-state">
          <i className="ti ti-forms" aria-hidden="true" />
          <p>No questions yet — click "Add Question" to start building your form</p>
        </div>
      ) : (
        questions.map((q, i) => (
          <div
            key={q.id}
            draggable
            onDragStart={e => handleDragStart(e, i)}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={e => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            className={[
              dragIndex === i ? 'dragging' : '',
              dragOverIndex === i && dragIndex !== i ? 'drag-over' : '',
            ].join(' ')}
            style={{ borderRadius: 12 }}
          >
            <QuestionNode
              question={q}
              index={i}
              prefix=""
              depth={0}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
            />
          </div>
        ))
      )}

      {/* Review panel (shown after submit) */}
      {submitted && questions.length > 0 && (
        <div className="submission-panel">
          <h2>
            <i className="ti ti-clipboard-list" aria-hidden="true" />
            Form Review
          </h2>

          {reviewItems.length === 0 ? (
            <p style={{ color: '#5f5e5a', fontSize: 14 }}>No questions to display.</p>
          ) : (
            reviewItems.map((item, i) => (
              <div className="review-item" key={i}>
                <span className="review-num">{item.num}</span>
                <span className="review-text">{item.text}</span>
                <span className="review-type">
                  {item.type === 'tf' ? 'True / False' : 'Short Answer'}
                </span>
                {item.type === 'tf' && item.tfAnswer && (
                  <span className="review-answer">
                    → answered: <strong>{item.tfAnswer}</strong>
                  </span>
                )}
                {item.type === 'short' && item.shortAnswer && (
  <span className="review-answer">
    → answer: <strong>{item.shortAnswer}</strong>
  </span>
)}
              </div>
            ))
          )}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <i className="ti ti-check" aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
