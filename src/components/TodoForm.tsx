// components/TodoForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { todoService } from '@/services/todoService';
import type { TodoFormData } from '@/types/todo';

interface Props {
  todoId?: string;
  isEdit?: boolean;
}

const TodoForm: React.FC<Props> = ({ todoId, isEdit = false }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<TodoFormData>({ todo: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && todoId && user) {
      const fetchTodo = async () => {
        try {
          const todo = await todoService.getTodoById(todoId, user.uid);
          if (todo) {
            setFormData({ todo: todo.todo });
          } else {
            router.push('/404');
          }
        } catch (error) {
          console.error('Fetch todo error:', error);
          router.push('/404');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchTodo();
    }
  }, [todoId, isEdit, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.todo?.trim() || !user) return;
    
    setLoading(true);
    try {
      if (isEdit && todoId) {
        await todoService.editTodo(todoId, user.uid, formData);
      } else {
        await todoService.addTodo(user.uid, formData);
      }
      router.push('/');
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-[#7d7d34b6] rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? 'Edit Todo' : 'Add New Todo'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="todo-input"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Todo Title
          </label>
          <input
            id="todo-input"
            type="text"
            placeholder="Enter todo title..."
            value={formData.todo ?? ''}
            onChange={(e) => setFormData({ ...formData, todo: e.target.value })}
            required
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
            aria-required="true"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || !formData.todo?.trim()}
            className="flex-1 bg-[#0a80e1] text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Todo' : 'Add Todo'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={loading}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;