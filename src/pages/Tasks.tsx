import { useState, useMemo } from 'react';
import { useAppStore } from '../store';

type TaskType = 'homework' | 'housework' | 'behavior';

export default function Tasks() {
  const { tasks, completeTask, addTask, deleteTask, currentRole } = useAppStore();
  const [filter, setFilter] = useState<TaskType | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'homework' as TaskType,
    rewardStars: 1,
  });

  const isParent = currentRole === 'parent';

  const sortedTasks = useMemo(() => {
    let filtered = filter === 'all' 
      ? tasks 
      : tasks.filter(t => t.type === filter);
    
    if (selectedDate) {
      filtered = filtered.filter(t => 
        new Date(t.createdAt).toDateString() === new Date(selectedDate).toDateString()
      );
    }
    
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filter, selectedDate]);

  const dateGroups = useMemo(() => {
    const groups: { [key: string]: typeof tasks } = {};
    const allTasks = filter === 'all' ? tasks : tasks.filter(t => t.type === filter);
    
    allTasks.forEach(task => {
      const date = new Date(task.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
    });
    
    return groups;
  }, [tasks, filter]);

  const handleAddTask = () => {
    if (newTask.title) {
      addTask(newTask);
      setNewTask({
        title: '',
        description: '',
        type: 'homework',
        rewardStars: 1,
      });
      setShowAddModal(false);
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'homework': return '📚';
      case 'housework': return '🧹';
      case 'behavior': return '😊';
      default: return '📋';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const taskDate = new Date(date).toDateString();
    
    if (taskDate === today) return '今天';
    if (taskDate === yesterday) return '昨天';
    return new Date(date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">任务中心</h1>
        {isParent && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all"
          >
            + 新增任务
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all' as const, label: '全部', emoji: '📋' },
          { key: 'homework' as const, label: '作业', emoji: '📚' },
          { key: 'housework' as const, label: '家务', emoji: '🧹' },
          { key: 'behavior' as const, label: '表现', emoji: '😊' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setFilter(item.key);
              setSelectedDate(null);
            }}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filter === item.key && !selectedDate
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">📅 {formatDate(new Date(selectedDate))}</span>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-blue-500 text-sm font-bold"
          >
            显示全部
          </button>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(dateGroups)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, dateTasks]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-gray-700">
                  📅 {formatDate(new Date(date))}
                </span>
                <span className="text-sm text-gray-500">
                  ({dateTasks.filter(t => !t.completed).length} 待完成)
                </span>
              </div>
              <div className="space-y-3">
                {dateTasks
                  .sort((a, b) => {
                    if (a.completed !== b.completed) {
                      return a.completed ? 1 : -1;
                    }
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`bg-white rounded-xl p-4 shadow-md transition-all ${
                        task.completed ? 'opacity-60' : 'hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-3xl mr-4">{getTypeEmoji(task.type)}</span>
                          <div>
                            <div className="font-bold text-gray-800 text-lg">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-gray-500">{task.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-yellow-500 font-bold">
                              +{task.rewardStars}⭐
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(task.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {!task.completed ? (
                            <button
                              onClick={() => completeTask(task.id)}
                              className="bg-green-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-600 transition-all"
                            >
                              完成
                            </button>
                          ) : (
                            <span className="text-green-500 font-bold px-2">✅</span>
                          )}
                          {isParent && (
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-500 hover:text-red-700 font-bold px-2"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        {sortedTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p>暂无任务</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">新增任务</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">任务标题</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                  placeholder="输入任务标题"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">描述</label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                  placeholder="输入任务描述"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">任务类型</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as TaskType })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                >
                  <option value="homework">📚 作业</option>
                  <option value="housework">🧹 家务</option>
                  <option value="behavior">😊 表现</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">奖励星星</label>
                <select
                  value={newTask.rewardStars}
                  onChange={(e) => setNewTask({ ...newTask, rewardStars: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                >
                  <option value={1}>1 ⭐</option>
                  <option value={2}>2 ⭐</option>
                  <option value={3}>3 ⭐</option>
                  <option value={5}>5 ⭐</option>
                  <option value={10}>10 ⭐</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.title}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
