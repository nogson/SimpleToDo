/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  LayoutDashboard, 
  Calendar, 
  Bookmark,
  Search,
  Bell,
  Clock,
  ChevronRight,
  Check
} from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

type Filter = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('professional-todo-items');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('professional-todo-items', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (!inputValue.trim()) return;
    
    // Assign a random priority for "Professional" look
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    const categories = ['Design', 'Development', 'Marketing', 'Admin'];
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    };
    
    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
  }, [inputValue]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">TaskMaster</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="bg-slate-800 text-white rounded-md px-3 py-2 flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <LayoutDashboard size={18} className="opacity-80" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
            <span className="text-[10px] font-bold bg-blue-600 px-2 py-0.5 rounded-full">
              {todos.filter(t => !t.completed).length}
            </span>
          </div>

          <div className="hover:bg-slate-800 hover:text-white rounded-md px-3 py-2 flex items-center space-x-3 cursor-pointer transition-colors text-slate-400">
            <Calendar size={18} className="opacity-60" />
            <span className="text-sm font-medium">Calendar</span>
          </div>

          <div className="hover:bg-slate-800 hover:text-white rounded-md px-3 py-2 flex items-center space-x-3 cursor-pointer transition-colors text-slate-400">
            <Bookmark size={18} className="opacity-60" />
            <span className="text-sm font-medium">Bookmarks</span>
          </div>

          <div className="mt-8 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Projects
          </div>
          <div className="mt-2 space-y-1">
            <div className="px-3 py-2 text-sm flex items-center space-x-3 cursor-pointer hover:bg-slate-800 rounded-md transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-400 text-xs">Design System</span>
            </div>
            <div className="px-3 py-2 text-sm flex items-center space-x-3 cursor-pointer hover:bg-slate-800 rounded-md transition-colors">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-slate-400 text-xs">Marketing</span>
            </div>
            <div className="px-3 py-2 text-sm flex items-center space-x-3 cursor-pointer hover:bg-slate-800 rounded-md transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-slate-400 text-xs">Development</span>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
            KT
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">Kenta Tanaka</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Administrator</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Active Tasks</h1>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Add Task Input */}
          <section className="bg-white rounded-xl border border-slate-200 p-1 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
            <form 
              onSubmit={(e) => { e.preventDefault(); addTodo(); }}
              className="flex items-center w-full"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter a new task..."
                className="flex-1 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all mr-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 active:scale-95"
              >
                Add Task
              </button>
            </form>
          </section>

          {/* Filtering & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 p-1 bg-slate-200 rounded-xl shrink-0">
              {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filter === f 
                      ? 'bg-white shadow-sm text-slate-800' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'active' ? 'Ongoing' : 'Completed'}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Showing: {filteredTodos.length} Tasks
            </div>
          </div>

          {/* Todo List */}
          <div className="grid gap-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                    className={`bg-white group p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-blue-300 transition-all ${
                      todo.completed ? 'opacity-60 bg-slate-50/50' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 border-2 rounded shrink-0 cursor-pointer flex items-center justify-center transition-all ${
                        todo.completed 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'border-slate-300 hover:border-blue-400 group-hover:border-slate-400'
                      }`}
                    >
                      {todo.completed && <Check size={14} strokeWidth={3} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate transition-all ${
                        todo.completed ? 'text-slate-500 line-through' : 'text-slate-800'
                      }`}>
                        {todo.text}
                      </div>
                      <div className="flex items-center space-x-3 mt-1.5">
                        <span className="text-[10px] text-slate-400 font-medium flex items-center uppercase tracking-tighter">
                          <Clock size={12} className="mr-1" />
                          {todo.completed ? 'Completed' : 'Today 14:00'}
                        </span>
                        {todo.category && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 uppercase tracking-tighter">
                            {todo.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {todo.priority && !todo.completed && (
                        <div className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-tighter shrink-0 ${
                          todo.priority === 'high' ? 'bg-rose-50 text-rose-600' :
                          todo.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {todo.priority} Priority
                        </div>
                      )}
                      
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-slate-300 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 flex flex-col items-center justify-center text-slate-300 gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <CheckCircle2 size={32} className="opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No tasks found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
