
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {Search, Filter, Star, Clock, MapPin, CheckCircle, Circle, Play, BookOpen} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'
import toast from 'react-hot-toast'

const TasksPage: React.FC = () => {
  const { tasks, locations, updateTaskProgress, completeTask, westLakePoetryTask } = useGameStore()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all')
  const [filterType, setFilterType] = useState<'all' | 'exploration' | 'knowledge' | 'social' | 'collection'>('all')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesType = filterType === 'all' || task.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getTaskTypeIcon = (type: string) => {
    const icons = {
      exploration: '🗺️',
      knowledge: '📚',
      social: '👥',
      collection: '💎'
    }
    return icons[type as keyof typeof icons] || '📋'
  }

  const getTaskTypeColor = (type: string) => {
    const colors = {
      exploration: 'bg-blue-100 text-blue-800',
      knowledge: 'bg-green-100 text-green-800',
      social: 'bg-purple-100 text-purple-800',
      collection: 'bg-yellow-100 text-yellow-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status as keyof typeof colors]
  }

  const getStatusText = (status: string) => {
    const texts = {
      not_started: '未开始',
      in_progress: '进行中',
      completed: '已完成'
    }
    return texts[status as keyof typeof texts]
  }

  const handleStartTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status === 'not_started') {
      updateTaskProgress(taskId, 1)
      toast.success(`开始任务：${task.title}`, {
        duration: 2000,
        icon: '🎯'
      })
    }
  }

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status === 'in_progress') {
      completeTask(taskId)
      toast.success(`完成任务：${task.title}！获得奖励：${task.reward}`, {
        duration: 3000,
        icon: '🎉'
      })
    }
  }

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId)
    return location?.name || '未知地点'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <TopNavigation />
      
      <div className="p-4 pb-20">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-amber-800 font-serif mb-2">任务大厅</h1>
          <p className="text-amber-600">完成任务，探索古代文明的奥秘</p>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" size={20} />
            <input
              type="text"
              placeholder="搜索任务名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* 筛选按钮 */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-amber-600" />
              <span className="text-sm text-amber-800 font-medium">状态:</span>
            </div>
            {(['all', 'not_started', 'in_progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/80 text-amber-700 hover:bg-amber-100'
                }`}
              >
                {status === 'all' ? '全部' : getStatusText(status)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-amber-800 font-medium">类型:</span>
            {(['all', 'exploration', 'knowledge', 'social', 'collection'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterType === type
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/80 text-amber-700 hover:bg-amber-100'
                }`}
              >
                {type === 'all' ? '全部' : 
                 type === 'exploration' ? '探索' :
                 type === 'knowledge' ? '知识' :
                 type === 'social' ? '社交' : '收集'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 任务统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-200">
            <div className="text-2xl font-bold text-amber-800">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-amber-600">已完成</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-200">
            <div className="text-2xl font-bold text-blue-800">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-blue-600">进行中</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-200">
            <div className="text-2xl font-bold text-gray-800">
              {tasks.filter(t => t.status === 'not_started').length}
            </div>
            <div className="text-sm text-gray-600">未开始</div>
          </div>
        </motion.div>

          {/* 任务列表 */}
          <div className="space-y-4">
            {/* 西湖诗词创作任务 - 特殊任务卡片 */}
            {filteredTasks.some(task => task.title.includes('西湖') || task.description.includes('西湖')) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">🌸</div>
                    <div>
                      <h3 className="font-bold text-blue-800 text-lg">西湖诗词创作</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          AI交互
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          文化探索
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BookOpen className="text-blue-500" size={24} />
                  </div>
                </div>

                <p className="text-blue-600 text-sm mb-3">
                  通过AI互动式问答与创作，了解西湖相关的诗词、诗人及文化背景。完成三阶段任务后解锁更多西湖文化探索。
                </p>

                <div className="flex items-center text-blue-500 text-sm mb-3">
                  <MapPin size={14} className="mr-1" />
                  西湖
                </div>

                {/* 阶段进度 */}
                <div className="mb-3">
                  <div className="text-sm text-blue-600 mb-2">任务阶段进度</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">诗句接龙</span>
                      <span className="text-xs text-blue-600">
                        {westLakePoetryTask.stages.poetry_riddle.progress}/{westLakePoetryTask.stages.poetry_riddle.maxProgress}
                      </span>
                    </div>
                    <div className="bg-blue-100 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(westLakePoetryTask.stages.poetry_riddle.progress / westLakePoetryTask.stages.poetry_riddle.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Star size={14} className="text-yellow-500" />
                    <span className="text-sm text-blue-600">诗心值 +{westLakePoetryTask.rewards.poetryValue}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/west-lake-poetry')}
                    className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <BookOpen size={14} />
                    <span>开始诗词创作</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-sm"
            >
              {/* 任务头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getTaskTypeIcon(task.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">{task.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.type)}`}>
                        {task.type === 'exploration' ? '探索' :
                         task.type === 'knowledge' ? '知识' :
                         task.type === 'social' ? '社交' : '收集'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {task.status === 'completed' ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : task.status === 'in_progress' ? (
                    <Circle className="text-blue-500" size={24} />
                  ) : (
                    <Circle className="text-gray-400" size={24} />
                  )}
                </div>
              </div>

              {/* 任务描述 */}
              <p className="text-amber-600 text-sm mb-3">{task.description}</p>

              {/* 任务位置 */}
              <div className="flex items-center text-amber-500 text-sm mb-3">
                <MapPin size={14} className="mr-1" />
                {getLocationName(task.locationId)}
              </div>

              {/* 进度条 */}
              {task.status !== 'not_started' && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-amber-600 mb-1">
                    <span>进度</span>
                    <span>{task.progress}/{task.maxProgress}</span>
                  </div>
                  <div className="bg-amber-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* 时间限制 */}
              {task.timeLimit && (
                <div className="flex items-center text-orange-500 text-sm mb-3">
                  <Clock size={14} className="mr-1" />
                  时间限制: {Math.floor(task.timeLimit / 60000)} 分钟
                </div>
              )}

              {/* 奖励和操作 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-sm text-amber-600">{task.reward}</span>
                </div>
                
                <div className="flex space-x-2">
                  {task.status === 'not_started' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStartTask(task.id)}
                      className="flex items-center space-x-1 bg-amber-600 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-700 transition-colors"
                    >
                      <Play size={12} />
                      <span>开始</span>
                    </motion.button>
                  )}
                  
                  {task.status === 'in_progress' && task.progress >= task.maxProgress && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteTask(task.id)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={12} />
                      <span>完成</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">📋</div>
            <p className="text-amber-600">没有找到符合条件的任务</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TasksPage
