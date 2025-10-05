
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Star, Clock, Users} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'
import toast from 'react-hot-toast'

const HomePage: React.FC = () => {
  const { 
    locations, 
    tasks, 
    events, 
    unlockLocation, 
    updateTaskProgress,
    updateTime 
  } = useGameStore()
  
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showEventNotification, setShowEventNotification] = useState(false)
  const [currentCity, setCurrentCity] = useState<string | null>(null) // 当前查看的城市

  // 更新时间
  useEffect(() => {
    const timer = setInterval(updateTime, 60000) // 每分钟更新一次
    return () => clearInterval(timer)
  }, [updateTime])

  // 检查动态事件
  useEffect(() => {
    const activeEvents = events.filter(event => event.timeRemaining > 0)
    if (activeEvents.length > 0 && !showEventNotification) {
      setShowEventNotification(true)
      toast.success(`发现 ${activeEvents.length} 个动态事件！`, {
        duration: 3000,
        icon: '🎉'
      })
    }
  }, [events, showEventNotification])

  const getLocationIcon = (type: string) => {
    const icons = {
      palace: '🏰',
      temple: '🏛️',
      garden: '🌸',
      mountain: '⛰️',
      river: '🌊',
      village: '🏘️',
      city: '🏙️'
    }
    return icons[type as keyof typeof icons] || '📍'
  }

  const handleLocationClick = (locationId: string) => {
    const location = locations.find(l => l.id === locationId)
    if (!location) return

    if (!location.unlocked) {
      // 解锁地点
      unlockLocation(locationId)
      toast.success(`解锁了${location.name}！`, {
        duration: 2000,
        icon: '🗝️'
      })
    }
    
    // 如果是城市，切换到城市视图
    if (location.isCity) {
      setCurrentCity(locationId)
      toast.success(`进入${location.name}`, {
        duration: 2000,
        icon: '🏙️'
      })
    } else {
      setSelectedLocation(locationId)
    }
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
      toast.success(`开始任务：${task.title}`, {
        duration: 2000,
        icon: '🎯'
      })
    }
  }

  // 过滤显示的地点
  const displayedLocations = currentCity 
    ? locations.filter(l => l.parentCity === currentCity || l.id === currentCity)
    : locations.filter(l => !l.parentCity) // 只显示城市

  const selectedLocationData = locations.find(l => l.id === selectedLocation)
  const locationTasks = tasks.filter(t => t.locationId === selectedLocation)
  const locationEvents = events.filter(e => 
    selectedLocationData?.events.includes(e.id)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <TopNavigation />
      
      {/* 城市标题和返回按钮 */}
      {currentCity && (
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentCity(null)}
                className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors"
              >
                ← 返回世界地图
              </button>
              <div>
                <h1 className="text-xl font-bold text-amber-800 font-serif">
                  {locations.find(l => l.id === currentCity)?.name}
                </h1>
                <p className="text-sm text-amber-600">
                  {locations.find(l => l.id === currentCity)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 地图主区域 */}
      <div className="relative h-[calc(100vh-120px)] overflow-hidden">
        {/* 地图背景 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=1200')`
          }}
        />
        
        {/* 古风纹理覆盖 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-orange-100/20 to-red-100/30" />
        
        {/* 地点标记 */}
        <div className="relative w-full h-full">
          {displayedLocations.map((location) => (
            <motion.div
              key={location.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * locations.indexOf(location) }}
              className="absolute cursor-pointer"
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleLocationClick(location.id)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative p-3 rounded-full shadow-lg border-2 transition-all ${
                  location.unlocked
                    ? 'bg-white border-amber-400 text-amber-700'
                    : 'bg-gray-300 border-gray-400 text-gray-500'
                }`}
              >
                <div className="text-2xl">
                  {location.unlocked ? getLocationIcon(location.type) : '🔒'}
                </div>
                
                {location.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  />
                )}
              </motion.div>
              
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-amber-800 whitespace-nowrap shadow-md">
                {location.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 迷雾效果（未解锁区域） */}
        {displayedLocations.filter(l => !l.unlocked).map((location) => (
          <motion.div
            key={`fog-${location.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="absolute pointer-events-none"
            style={{
              left: `${location.x - 15}%`,
              top: `${location.y - 15}%`,
              width: '30%',
              height: '30%'
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-400/40 via-gray-300/30 to-gray-200/20 rounded-full blur-xl" />
          </motion.div>
        ))}
      </div>

      {/* 地点详情弹窗 */}
      <AnimatePresence>
        {selectedLocation && selectedLocationData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  {getLocationIcon(selectedLocationData.type)}
                </div>
                <h2 className="text-2xl font-bold text-amber-800 font-serif">
                  {selectedLocationData.name}
                </h2>
                <p className="text-amber-600 text-sm mt-2">
                  {selectedLocationData.description}
                </p>
              </div>

              {/* 任务列表 */}
              {locationTasks.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <Star size={16} className="mr-1" />
                    可用任务
                  </h3>
                  <div className="space-y-2">
                    {locationTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-amber-50 rounded-lg p-3 border border-amber-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-amber-800">{task.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status === 'completed' ? '已完成' :
                             task.status === 'in_progress' ? '进行中' : '未开始'}
                          </span>
                        </div>
                        <p className="text-amber-600 text-sm mb-2">{task.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-amber-500">奖励: {task.reward}</span>
                          {task.status === 'not_started' && (
                            <button
                              onClick={() => handleStartTask(task.id)}
                              className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs hover:bg-amber-700 transition-colors"
                            >
                              开始任务
                            </button>
                          )}
                          {task.status === 'completed' && (
                            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                              已完成
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 动态事件 */}
              {locationEvents.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <Clock size={16} className="mr-1" />
                    动态事件
                  </h3>
                  <div className="space-y-2">
                    {locationEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-orange-50 rounded-lg p-3 border border-orange-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-orange-800">{event.title}</h4>
                          <div className="flex items-center text-xs text-orange-600">
                            <Users size={12} className="mr-1" />
                            {event.participants}/{event.maxParticipants}
                          </div>
                        </div>
                        <p className="text-orange-600 text-sm mb-2">{event.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-orange-500">
                            剩余: {Math.floor(event.timeRemaining / 60000)}分钟
                          </span>
                          <button className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs hover:bg-orange-700 transition-colors">
                            立即参与
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedLocation(null)}
                className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage
