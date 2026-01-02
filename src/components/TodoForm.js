'use client';

import { useState } from 'react';
import { createTodo, updateTodo } from '@/app/actions';

export default function TodoForm({ todo, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!todo;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing) {
        await updateTodo(todo._id, formData);
      } else {
        await createTodo(formData);
        e.target.reset(); // Reset form on success if adding
      }
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to save todo', error);
      alert('Failed to save todo');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group full-width">
        <label htmlFor="title" className="form-label">Task Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="What needs to be accomplished?"
          defaultValue={todo?.title}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority" className="form-label">Priority Level</label>
        <select
          id="priority"
          name="priority"
          className="form-select"
          defaultValue={todo?.priority || 'medium'}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="file" className="form-label">Attachment (PDF)</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf"
            className="form-input"
            style={{padding: '0.65rem'}}
          />
        </div>
        {todo?.fileUrl && (
          <div style={{fontSize: '0.8rem', marginTop: '0.5rem', marginLeft: '0.2rem'}}>
            <a href={todo.fileUrl} target="_blank" rel="noopener noreferrer" className="file-chip">
              📎 {todo.fileUrl.split('/').pop()}
            </a>
          </div>
        )}
      </div>

      <div className="form-group full-width">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Add details, notes, or subtasks..."
          defaultValue={todo?.description}
          className="form-textarea"
        />
      </div>

      <div className="full-width" style={{marginTop: '0.5rem'}}>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{width: '100%'}}>
          {isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create New Task')}
        </button>
        {isEditing && (
            <button type="button" className="btn btn-danger" onClick={onClose} style={{width: '100%', marginTop: '1rem'}}>
                Cancel
            </button>
        )}
      </div>
    </form>
  );
}
