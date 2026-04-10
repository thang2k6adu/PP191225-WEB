import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTasks } from '@/hooks/useTasks';
import {
  LuPlay as Play,
  LuCheck as Check,
  LuTrash2 as Trash2,
  LuPencil as Edit2,
  LuPlus as Plus,
  LuFilter as Filter,
} from 'react-icons/lu';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Task, TaskStatus } from '@/types/task';
import { COLORS } from '@/constants/theme';

const Tasks: React.FC = () => {
  const {
    tasks,
    activeTask,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    activateTask,
    completeTask,
    deleteTask,
  } = useTasks();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [formData, setFormData] = useState({
    name: '',
    estimateHours: '',
    deadline: '',
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.estimateHours || !formData.deadline) return;

    await createTask({
      name: formData.name,
      estimateHours: Number(formData.estimateHours),
      deadline: formData.deadline,
    });

    setFormData({ name: '', estimateHours: '', deadline: '' });
    setIsCreateModalOpen(false);
    fetchTasks();
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingTask ||
      !formData.name ||
      !formData.estimateHours ||
      !formData.deadline
    )
      return;

    await updateTask(editingTask.id, {
      name: formData.name,
      estimateHours: Number(formData.estimateHours),
      deadline: formData.deadline,
    });

    setFormData({ name: '', estimateHours: '', deadline: '' });
    setIsEditModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      estimateHours: task.estimateHours.toString(),
      deadline: task.deadline.split('T')[0], // Extract date only
    });
    setIsEditModalOpen(true);
  };

  const handleActivate = async (taskId: string) => {
    await activateTask(taskId);
    fetchTasks();
  };

  const handleComplete = async (taskId: string) => {
    await completeTask(taskId);
    fetchTasks();
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
      fetchTasks();
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800';
      case 'DONE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'PLANNED':
        return '📋';
      case 'ACTIVE':
        return '⏱️';
      case 'DONE':
        return '✅';
      default:
        return '📋';
    }
  };

  const filteredTasks =
    filterStatus === 'ALL'
      ? tasks
      : tasks.filter(task => task.status === filterStatus);

  const stats = {
    total: tasks.length,
    planned: tasks.filter(t => t.status === 'PLANNED').length,
    active: tasks.filter(t => t.status === 'ACTIVE').length,
    completed: tasks.filter(t => t.status === 'DONE').length,
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tasks Management - Donezo</title>
      </Helmet>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Tasks Management
            </h1>
            <p className="mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
              Manage all your tasks in one place
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              backgroundColor: COLORS.PRIMARY,
              color: COLORS.WHITE,
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Planned</div>
            <div className="text-2xl font-bold text-blue-900">
              {stats.planned}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="text-sm text-emerald-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-emerald-900">
              {stats.active}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.completed}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {(['ALL', 'PLANNED', 'ACTIVE', 'DONE'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Active Task Highlight */}
        {activeTask && (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">
                  Currently Working On
                </div>
                <div className="text-xl font-bold">{activeTask.name}</div>
                <div className="text-sm opacity-75 mt-1">
                  Estimate: {activeTask.estimateHours}h | Due:{' '}
                  {new Date(activeTask.deadline).toLocaleDateString()}
                </div>
              </div>
              <div className="text-4xl">⏱️</div>
            </div>
          </div>
        )}

        {/* Tasks Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estimate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map(task => (
                  <tr
                    key={task.id}
                    className={`hover:bg-gray-50 ${
                      task.isActive ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {getStatusIcon(task.status)}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {task.name}
                          </div>
                          {task.isActive && (
                            <div className="text-xs text-emerald-600 font-semibold mt-1">
                              ACTIVE NOW
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.estimateHours}h
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(task.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {task.status === 'PLANNED' && (
                          <button
                            onClick={() => handleActivate(task.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Start working"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {task.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleComplete(task.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as complete"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {task.status !== 'DONE' && (
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-lg">
                        No tasks found. Create one to get started!
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter task name"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Estimate (hours)
            </label>
            <input
              type="number"
              value={formData.estimateHours}
              onChange={e =>
                setFormData({ ...formData, estimateHours: e.target.value })
              }
              placeholder="e.g., 6"
              min="0.5"
              step="0.5"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={e =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        title="Edit Task"
      >
        <form onSubmit={handleEditTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter task name"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Estimate (hours)
            </label>
            <input
              type="number"
              value={formData.estimateHours}
              onChange={e =>
                setFormData({ ...formData, estimateHours: e.target.value })
              }
              placeholder="e.g., 6"
              min="0.5"
              step="0.5"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={e =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingTask(null);
              }}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Tasks;
