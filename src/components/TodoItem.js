'use client';

import { useState } from 'react';
import { toggleTodo, deleteTodo } from '@/app/actions';
import TodoForm from './TodoForm';

export default function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle(e) {
    await toggleTodo(todo._id, e.target.checked);
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await deleteTodo(todo._id);
    }
  }

  if (isEditing) {
    return (
      <div className="card">
        <TodoForm todo={todo} onClose={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="card todo-item" style={{ opacity: isDeleting ? 0.5 : 1 }}>
      <div className="checkbox-wrapper" title="Mark as completed">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="checkbox"
        />
      </div>

      <div className="todo-content">
        <div className="todo-header">
           <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
             {todo.title}
           </span>
           <span className={`badge priority-${todo.priority || 'medium'}`}>
             {todo.priority || 'medium'}
           </span>
        </div>

        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}

        {todo.fileUrl && (
          <a href={todo.fileUrl} target="_blank" rel="noopener noreferrer" className="file-chip">
            📄 Attachment
          </a>
        )}
      </div>

      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-sm"
          style={{backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)'}}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
