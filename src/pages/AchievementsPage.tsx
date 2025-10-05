
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {Trophy, Star, Crown, Target, Users, Clock, Gift} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'

const AchievementsPage: React.FC = () => {
  const { achievements } = useGameStore()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'exploration' | 'tasks' | 'social' | 'time'>('all')

  const filteredAchievements = achievements.filter(achievement =>
    selectedCategory === 'all' || achievement.type === selectedCategory
  )

  const getAchievementTypeIcon = (type: string) => {
    const icons = {
      exploration: Target,
      tasks: Trophy,
      social: Users,
      time: Clock
    }
    return icons[type as keyof typeof icons] || Trophy
  }

  const getAchievementTypeColor = (type: string) => {
    const colors = {
      exploration: 'from-blue-400 to-blue-600',
      tasks: 'from-green-400 to-green-600',
      social: 'from-purple-400 to-purple-600',
      time: 'from-orange-400 to-orange-600'
    }
    return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-600'
  }

  const getCategoryName = (type: string) => {
    const names = {
      exploration: '探索',
      tasks: '任务',
      social: '社交',
      time: '时间'
    }
    return names[type as keyof typeof names] || type
  }

  const completedCount = achievements.filter(a => a.completed).length
  const totalCount = achievements.length
  const completionRate = Math.round((completedCount / totalCount) * 100)

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
          <h1 className="text-3xl font-bold text-amber-800 font-serif mb-2">成就殿堂</h1>
          <p className="text-amber-600">展示您在古风世界中的荣耀成就</p>
        </motion.div>

        {/* 成就统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 border border-amber-200"
        >
          <div className="text-center mb-4">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-amber-800">成就大师</h2>
            <p className="text-amber-600">完成度 {completionRate}%</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-amber-600">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{totalCount - completedCount}</div>
              <div className="text-sm text-amber-600">待完成</div>
            </div>
          </div>

          {/* 整体进度条 */}
          <div className="mt-4">
            <div className="bg-amber-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              />
            </div>
          </div>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {(['all', 'exploration', 'tasks', 'social', 'time'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/80 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {category === 'all' ? '全部' : getCategoryName(category)}
            </button>
          ))}
        </motion.div>

        {/* 成就列表 */}
        <div className="grid gap-4">
          {filteredAchievements.map((achievement, index) => {
            const TypeIcon = getAchievementTypeIcon(achievement.type)
            const typeColor = getAchievementTypeColor(achievement.type)
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 transition-all ${
                  achievement.completed
                    ? 'border-yellow-400 shadow-lg'
                    : 'border-amber-200'
                }`}
              >
                {/* 完成标记 */}
                {achievement.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Crown size={16} className="text-white" />
                  </motion.div>
                )}

                <div className="flex items-start space-x-4">
                  {/* 成就图标 */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${typeColor} flex items-center justify-center shadow-lg ${
                    !achievement.completed ? 'opacity-50 grayscale' : ''
                  }`}>
                    <div className="text-2xl">{achievement.icon}</div>
                  </div>

                  {/* 成就信息 */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${
                        achievement.completed ? 'text-amber-800' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </h3>
                      <TypeIcon size={16} className={`${
                        achievement.completed ? 'text-amber-600' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      achievement.completed ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>

                    {/* 进度条 */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-amber-600 mb-1">
                        <span>进度</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="bg-amber-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${
                            achievement.completed 
                              ? 'from-yellow-400 to-orange-500'
                              : 'from-gray-300 to-gray-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* 奖励 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Gift size={14} className={`${
                          achievement.completed ? 'text-yellow-500' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          achievement.completed ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          {achievement.reward}
                        </span>
                      </div>
                      
                      {achievement.completed && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Star size={14} />
                          <span className="text-sm font-medium">已获得</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 光效（仅已完成的成就） */}
                {achievement.completed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl pointer-events-none"
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-amber-600">该分类下暂无成就</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AchievementsPage
