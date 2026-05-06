import React from 'react';

/**
 * QuestionNode — recursive component that renders a single question
 * and its nested children (if the question is True/False and answered True).
 *
 * Props:
 *   question   — the question object { id, text, type, tfAnswer, children }
 *   index      — position among siblings (0-based)
 *   prefix     — parent numbering prefix, e.g. "Q1" or "Q1.1"
 *   depth      — nesting depth (0 = root)
 *   onUpdate   — (id, updatedQuestion) => void
 *   onDelete   — (id) => void
 */
function QuestionNode({ question, index, prefix, depth = 0, onUpdate, onDelete }) {
  // Compute display number: Q1 / Q1.1 / Q1.1.2 ...
  const num = prefix ? `${prefix}.${index + 1}` : `Q${index + 1}`;
  const isRoot = depth === 0;

  // Generic field updater
  const updateField = (field, value) => {
    onUpdate(question.id, { ...question, [field]: value });
  };

  // Update a child within this question's children array
  const updateChild = (childId, updated) => {
    const newChildren = question.children.map(c => c.id === childId ? updated : c);
    onUpdate(question.id, { ...question, children: newChildren });
  };

  // Delete a child from this question
  const deleteChild = (childId) => {
    const newChildren = question.children.filter(c => c.id !== childId);
    onUpdate(question.id, { ...question, children: newChildren });
  };

  // Add a new blank child question
  const addChild = () => {
    const newChild = {
      id: Math.random().toString(36).slice(2, 9),
      text: '',
      type: 'short',
      tfAnswer: null,
      children: [],
    };
    onUpdate(question.id, { ...question, children: [...question.children, newChild] });
  };

  // Children are only shown when type=tf and answer=true
  const showChildren = question.type === 'tf' && question.tfAnswer === 'true';

  return (
    <div className="question-card">
      {/* Header row: drag handle (root only), number badge, delete */}
      <div className="q-header">
        {isRoot && (
          <span className="drag-handle" aria-label="drag to reorder">
            <i className="ti ti-grip-vertical" aria-hidden="true" />
          </span>
        )}
        <span className="q-number">{num}</span>
        <div className="q-controls">
          <button
            className="btn btn-sm btn-delete"
            onClick={() => onDelete(question.id)}
            title={`Delete ${num}`}
            aria-label={`Delete question ${num}`}
          >
            <i className="ti ti-trash" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      {/* Text + type fields */}
      <div className="q-fields">
        <input
          type="text"
          placeholder="Type your question here..."
          value={question.text}
          onChange={e => updateField('text', e.target.value)}
          aria-label={`Question ${num} text`}
        />
        <select
          value={question.type}
          onChange={e => updateField('type', e.target.value)}
          aria-label={`Question ${num} type`}
        >
          <option value="short">Short Answer</option>
          <option value="tf">True / False</option>
        </select>
      </div>

      {/* True/False radio row */}
      {question.type === 'tf' && (
        <div className="tf-answer">
          <span>Answer:</span>
          {[
            { value: 'true', label: 'True' },
            { value: 'false', label: 'False' },
          ].map(opt => (
            <label
              key={opt.value}
              className={question.tfAnswer === opt.value ? 'selected' : ''}
            >
              <input
                type="radio"
                name={`tf-${question.id}`}
                value={opt.value}
                checked={question.tfAnswer === opt.value}
                onChange={() => updateField('tfAnswer', opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}

      {/* Nested children area — only when type=tf and answer=true */}
      {showChildren && (
        <div className="children-area">
          {question.children.map((child, ci) => (
            <QuestionNode
              key={child.id}
              question={child}
              index={ci}
              prefix={num}
              depth={depth + 1}
              onUpdate={updateChild}
              onDelete={deleteChild}
            />
          ))}
          <button className="add-child-btn" onClick={addChild}>
            <i className="ti ti-plus" aria-hidden="true" />
            Add sub-question under {num}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionNode;
