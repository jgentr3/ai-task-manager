import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskFilter from '../components/TaskFilter';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import taskService from '../services/taskService';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all'
  });

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
    overdue: 0
  });

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await taskService.getAllTasks();
      setTasks(data.tasks || []);
      setStats(data.stats || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !filters.search ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle create task
  const handleCreateTask = async (formData) => {
    try {
      const newTask = await taskService.createTask(formData);
      setTasks(prev => [newTask, ...prev]);
      setIsFormOpen(false);

      // Show success message
      showSuccessMessage('Task created successfully!');

      // Refresh to get updated stats
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      throw err; // Re-throw to show error in form
    }
  };

  // Handle edit task
  const handleEditTask = async (formData) => {
    try {
      const updatedTask = await taskService.updateTask(selectedTask.id, formData);
      setTasks(prev => prev.map(task =>
        task.id === selectedTask.id ? updatedTask : task
      ));
      setIsFormOpen(false);
      setSelectedTask(null);

      showSuccessMessage('Task updated successfully!');
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));

      showSuccessMessage('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, newStatus);
      setTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task
      ));

      showSuccessMessage(`Task marked as ${newStatus}!`);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task status');
      console.error('Error updating status:', err);
    }
  };

  // Open create modal
  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all'
    });
  };

  // Success message (you can replace with a toast notification library)
  const showSuccessMessage = (message) => {
    // Simple alert for now - can be replaced with a toast library
    console.log('Success:', message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* App Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center text-sm text-gray-700">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary text-sm"
              >
                <svg
                  className="w-5 h-5 sm:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
              <p className="mt-1 text-gray-600">
                Manage and organize your tasks efficiently
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="btn btn-primary shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Task
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-sm text-blue-700 font-medium mb-1">Total</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total || tasks.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <div className="text-sm text-gray-700 font-medium mb-1">Pending</div>
              <div className="text-2xl font-bold text-gray-900">{stats.byStatus?.pending || 0}</div>
            </div>
            <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
              <div className="text-sm text-yellow-700 font-medium mb-1">In Progress</div>
              <div className="text-2xl font-bold text-yellow-900">{stats.byStatus?.['in-progress'] || 0}</div>
            </div>
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="text-sm text-green-700 font-medium mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-900">{stats.byStatus?.completed || 0}</div>
            </div>
            <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <div className="text-sm text-red-700 font-medium mb-1">Overdue</div>
              <div className="text-2xl font-bold text-red-900">{stats.overdue || 0}</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <TaskFilter
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{filteredTasks.length}</span> of{' '}
            <span className="font-medium text-gray-900">{tasks.length}</span> tasks
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={formMode === 'create' ? handleCreateTask : handleEditTask}
        task={selectedTask}
        mode={formMode}
      />
    </div>
  );
};

export default Dashboard;
