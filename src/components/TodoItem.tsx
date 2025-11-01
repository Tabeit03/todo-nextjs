// components/TodoItem.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Todo } from '@/types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

const TodoItem: React.FC<Props> = ({ todo, onToggle, onEdit, onDelete, isUpdating = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const handleToggle = () => {
    onToggle(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    if (!confirm('Delete this todo?')) return;
    onDelete(todo.id);
  };

  const handleEdit = () => {
    if (isEditing) {
      if (editText.trim()) {
        onEdit(todo.id, editText);
        setIsEditing(false);
      } else {
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <li
      className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      role="listitem"
    >
      <Link
        href={`/edit/${todo.id}`}
        className="flex-1 cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-red-300 p-2 rounded"
        aria-label={`Edit ${todo.todo}`}
      >
        <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
          {todo.todo}
        </span>
      </Link>

      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className={`ml-4 px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          todo.completed
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-red-100 text-red-800 hover:bg-red-200'
        } ${isUpdating ? 'opacity-50' : ''}`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isUpdating ? 'Updating...' : todo.completed ? 'Completed' : 'Incomplete'}
      </button>

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
          autoFocus
          aria-label={`Editing: ${todo.todo}`}
          disabled={isUpdating}
        />
      ) : (
        <button
          onClick={handleEdit}
          disabled={isUpdating}
          className="ml-2 text-blue-700 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 text-sm disabled:opacity-50"
          aria-label="Edit todo inline"
        >
          Edit
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={isUpdating}
        className="ml-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 px-2 py-1 text-sm disabled:opacity-50"
        aria-label="Delete todo"
      >
        {isUpdating ? 'Deleting...' : 'Delete'}
      </button>
    </li>
  );
};

export default TodoItem;