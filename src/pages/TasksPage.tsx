
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Search, Filter, Star, Clock, MapPin, CheckCircle, Circle, Play} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'
import toast from 'react-hot-toast'

const TasksPage: React.FC = () => {
  const { tasks, locations, updateTaskProgress, completeTask } = useGameStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all')
  const [filterType, setFilterType] = useState<'all' | 'exploration' | 'knowledge' | 'social' | 'collection'>('all')
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [currentGuideTask, setCurrentGuideTask] = useState<any>(null)
  const [currentGuideLocation, setCurrentGuideLocation] = useState<any>(null)

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
    if (!task) return
    
    // 检查任务状态
    if (task.status === 'completed') {
      toast.error('此任务已完成，无法重复参与', {
        duration: 2000,
        icon: '❌'
      })
      return
    }
    
    if (task.status === 'in_progress') {
      toast.error('此任务正在进行中', {
        duration: 2000,
        icon: '⏳'
      })
      return
    }
    
    if (task.status === 'not_started') {
      updateTaskProgress(taskId, 1)
      
      // 显示导游指引
      const location = locations.find(l => l.id === task.locationId)
      if (location && location.guideInfo) {
        toast.success(`开始任务：${task.title}`, {
          duration: 2000,
          icon: '🎯'
        })
        
        // 显示导游指引弹窗
        setTimeout(() => {
          showGuideModalFunc(task, location)
        }, 1000)
      } else {
        toast.success(`开始任务：${task.title}`, {
          duration: 2000,
          icon: '🎯'
        })
      }
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

  const showGuideModalFunc = (task: any, location: any) => {
    setCurrentGuideTask(task)
    setCurrentGuideLocation(location)
    setShowGuideModal(true)
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
                  
                  {task.status === 'completed' && (
                    <div className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      <CheckCircle size={12} />
                      <span>已完成</span>
                    </div>
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

      {/* 导游指引弹窗 */}
      <AnimatePresence>
        {showGuideModal && currentGuideTask && currentGuideLocation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowGuideModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎯</div>
              <h2 className="text-2xl font-bold text-amber-800 font-serif mb-2">
                {currentGuideTask.title} - 导游指引
              </h2>
              <p className="text-amber-600 text-sm">
                {currentGuideLocation.name} · {currentGuideLocation.description}
              </p>
            </div>

            {/* 地点介绍 */}
            {currentGuideLocation.guideInfo && (
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                    <span className="text-lg mr-2">📖</span>
                    地点介绍
                  </h3>
                  <p className="text-amber-700 leading-relaxed">
                    {currentGuideLocation.guideInfo.introduction}
                  </p>
                </div>

                {/* 探索建议 */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="text-lg mr-2">💡</span>
                    探索建议
                  </h3>
                  <ul className="space-y-2">
                    {currentGuideLocation.guideInfo.explorationTips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start text-blue-700">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 亮点推荐 */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <span className="text-lg mr-2">⭐</span>
                    必看亮点
                  </h3>
                  <ul className="space-y-2">
                    {currentGuideLocation.guideInfo.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start text-green-700">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 实用信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
                      <span className="text-lg mr-2">🌤️</span>
                      最佳时间
                    </h3>
                    <p className="text-orange-700">{currentGuideLocation.guideInfo.bestTime}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <span className="text-lg mr-2">⏰</span>
                      建议时长
                    </h3>
                    <p className="text-purple-700">{currentGuideLocation.guideInfo.duration}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 关闭按钮 */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowGuideModal(false)}
                className="bg-amber-600 text-white px-8 py-3 rounded-xl hover:bg-amber-700 transition-colors font-medium"
              >
                开始探索之旅
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TasksPage
