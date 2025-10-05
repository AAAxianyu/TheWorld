
import React from 'react'
import { motion } from 'framer-motion'
import {Calendar, Clock, Users, Gift, Zap, Play} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'
import toast from 'react-hot-toast'

const EventsPage: React.FC = () => {
  const { events, joinEvent } = useGameStore()

  const getEventTypeIcon = (type: string) => {
    const icons = {
      festival: '🎊',
      discovery: '🔍',
      challenge: '⚔️'
    }
    return icons[type as keyof typeof icons] || '📅'
  }

  const getEventTypeColor = (type: string) => {
    const colors = {
      festival: 'from-purple-400 to-pink-500',
      discovery: 'from-blue-400 to-cyan-500',
      challenge: 'from-red-400 to-orange-500'
    }
    return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-500'
  }

  const getEventTypeName = (type: string) => {
    const names = {
      festival: '节庆活动',
      discovery: '考古发现',
      challenge: '挑战赛事'
    }
    return names[type as keyof typeof names] || type
  }

  const formatTimeRemaining = (timeRemaining: number) => {
    const hours = Math.floor(timeRemaining / 3600000)
    const minutes = Math.floor((timeRemaining % 3600000) / 60000)
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  const getUrgencyColor = (timeRemaining: number) => {
    if (timeRemaining < 1800000) return 'text-red-600' // 30分钟内
    if (timeRemaining < 3600000) return 'text-orange-600' // 1小时内
    return 'text-green-600'
  }

  const handleJoinEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId)
    if (event && event.participants < event.maxParticipants) {
      joinEvent(eventId)
      toast.success(`成功参与事件：${event.title}！`, {
        duration: 2000,
        icon: '🎉'
      })
    } else {
      toast.error('该事件已满员！', {
        duration: 2000,
        icon: '😅'
      })
    }
  }

  const activeEvents = events.filter(event => event.timeRemaining > 0)
  const expiredEvents = events.filter(event => event.timeRemaining <= 0)

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
          <h1 className="text-3xl font-bold text-amber-800 font-serif mb-2">动态事件</h1>
          <p className="text-amber-600">参与限时活动，获得珍贵奖励</p>
        </motion.div>

        {/* 事件统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">{activeEvents.length}</div>
            <div className="text-sm text-amber-600">进行中</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{events.length}</div>
            <div className="text-sm text-amber-600">总事件</div>
          </div>
        </motion.div>

        {/* 进行中的事件 */}
        {activeEvents.length > 0 && (
          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-amber-800 mb-4 flex items-center"
            >
              <Zap size={20} className="mr-2 text-green-500" />
              进行中的事件
            </motion.h2>

            <div className="space-y-4">
              {activeEvents.map((event, index) => {
                const typeColor = getEventTypeColor(event.type)
                const urgencyColor = getUrgencyColor(event.timeRemaining)
                const participationRate = (event.participants / event.maxParticipants) * 100
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-200 shadow-lg overflow-hidden"
                  >
                    {/* 背景动画 */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${typeColor} opacity-60`}
                    />

                    <div className="flex items-start space-x-4">
                      {/* 事件图标 */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typeColor} flex items-center justify-center shadow-lg`}>
                        <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                      </div>

                      {/* 事件信息 */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-amber-800">{event.title}</h3>
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            {getEventTypeName(event.type)}
                          </span>
                        </div>

                        <p className="text-amber-600 text-sm mb-3">{event.description}</p>

                        {/* 时间倒计时 */}
                        <div className={`flex items-center mb-2 ${urgencyColor}`}>
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm font-medium">
                            剩余时间: {formatTimeRemaining(event.timeRemaining)}
                          </span>
                        </div>

                        {/* 参与人数 */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-amber-600">
                            <Users size={16} className="mr-1" />
                            <span className="text-sm">
                              {event.participants}/{event.maxParticipants} 人参与
                            </span>
                          </div>
                          <div className="text-sm text-amber-500">
                            {Math.round(participationRate)}% 满员
                          </div>
                        </div>

                        {/* 参与进度条 */}
                        <div className="mb-3">
                          <div className="bg-amber-100 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${participationRate}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${typeColor}`}
                            />
                          </div>
                        </div>

                        {/* 奖励和操作 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Gift size={16} className="text-yellow-500" />
                            <span className="text-sm text-amber-600">{event.reward}</span>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleJoinEvent(event.id)}
                            disabled={event.participants >= event.maxParticipants}
                            className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              event.participants >= event.maxParticipants
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
                            }`}
                          >
                            <Play size={14} />
                            <span>
                              {event.participants >= event.maxParticipants ? '已满员' : '立即参与'}
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* 已结束的事件 */}
        {expiredEvents.length > 0 && (
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-bold text-gray-600 mb-4 flex items-center"
            >
              <Clock size={20} className="mr-2" />
              已结束的事件
            </motion.h2>

            <div className="space-y-4">
              {expiredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-300 opacity-70"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <div className="text-xl grayscale">{getEventTypeIcon(event.type)}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-600">{event.title}</h3>
                      <p className="text-gray-500 text-sm">{event.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">已结束</span>
                        <span className="text-xs text-gray-400">
                          {event.participants}/{event.maxParticipants} 人参与
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 无事件状态 */}
        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">📅</div>
            <p className="text-amber-600 mb-2">暂无动态事件</p>
            <p className="text-amber-500 text-sm">请稍后查看，精彩活动即将开启！</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default EventsPage
