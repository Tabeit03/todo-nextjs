// components/TodoList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { todoService } from '@/services/todoService';
import type { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'completed' | 'incomplete' | ''>('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = 5;

  // Real-time listener
  useEffect(() => {
    if (!user) return;

    const unsubscribe = todoService.subscribeTodos(user.uid, (newTodos) => {
      setTodos(newTodos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Client-side filter/search
  const filtered = todos.filter((todo) => {
    const matchesSearch = searchText.trim() === '' || todo.todo.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      filterStatus === '' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'incomplete' && !todo.completed);
    return matchesSearch && matchesStatus;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageStart = (currentPage - 1) * limit;
  const pageItems = filtered.slice(pageStart, pageStart + limit);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !user) return;
    
    setAdding(true);
    try {
      await todoService.addTodo(user.uid, { todo: newTodoTitle.trim() });
      setNewTodoTitle('');
      handlePageChange(1);
    } catch (error) {
      console.error('Add todo error:', error);
      alert('Error adding todo. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    if (!user) return;
    try {
      await todoService.editTodo(id, user.uid, { completed });
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleEdit = async (id: string, newText: string) => {
    if (!user) return;
    try {
      await todoService.editTodo(id, user.uid, { todo: newText });
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await todoService.deleteTodo(id, user.uid);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleFilterChange = (s: string) => {
    setFilterStatus((s as 'completed' | 'incomplete' | '') || '');
    handlePageChange(1);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  if (loading) {
    return <div className="text-center py-8" role="status" aria-live="polite">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-[#3a66bf]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Todo List</h1>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-6 cursor-pointer flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="flex-1 font-medium cursor-pointer p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Enter a new task"
          disabled={adding}
        />
        <button
          type="submit"
          disabled={adding || !newTodoTitle.trim()}
          className="bg-gray-50 font-bold cursor-pointer py-3 px-6 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {adding ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder="Search by title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 p-3 font-medium cursor-pointer border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search todos by title"
        />
        
        <select
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="p-3 cursor-pointer font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter todos by status"
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* Todo Items */}
      <ul role="list" aria-label="Todo list" className="space-y-4 mb-6">
        {pageItems.length === 0 ? (
          <li className="text-center py-8 font-bold text-[#f1bcbc]">NO TODOS FOUND.</li>
        ) : (
          pageItems.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex justify-center items-center gap-4 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
            className="px-3 py-2 font-medium bg-gray-300 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
          >
            « Back to page 1
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-2 font-medium bg-gray-300 cursor-pointer border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
          >
            ‹ Prev
          </button>
          <span className="px-3 py-2 font-medium">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-2 font-medium bg-gray-300 cursor-pointer border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
          >
            Next ›
          </button>
        </nav>
      )}
    </div>
  );
};

export default TodoList;