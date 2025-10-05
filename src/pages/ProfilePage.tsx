
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {User, Edit, History, Trophy, MapPin, Calendar, Star} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useAuth } from '../hooks/useAuth'
import { useGameStore } from '../store/gameStore'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const { 
    userLevel, 
    userExperience, 
    locations, 
    tasks, 
    achievements,
    dynamicAchievements,
    nfts
  } = useGameStore()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'nfts'>('overview')
  const [isEditing, setIsEditing] = useState(false)

  const unlockedLocations = locations.filter(l => l.unlocked)
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const completedAchievements = achievements.filter(a => a.completed)
  const completedDynamicAchievements = dynamicAchievements.filter(a => a.completed)
  const totalNFTs = nfts.length

  const experienceToNextLevel = (userLevel * 1000) - (userExperience % 1000)
  const progressPercentage = ((userExperience % 1000) / 1000) * 100

  const getRecentActivities = () => {
    const activities = [
      ...completedTasks.slice(-5).map(task => ({
        id: task.id,
        type: 'task',
        title: `完成任务：${task.title}`,
        time: '2小时前',
        icon: '✅'
      })),
      ...unlockedLocations.slice(-3).map(location => ({
        id: location.id,
        type: 'location',
        title: `解锁地点：${location.name}`,
        time: '1天前',
        icon: '🗝️'
      })),
      ...completedAchievements.slice(-3).map(achievement => ({
        id: achievement.id,
        type: 'achievement',
        title: `获得成就：${achievement.title}`,
        time: '3天前',
        icon: '🏆'
      }))
    ]
    
    return activities.slice(0, 10)
  }

  const recentActivities = getRecentActivities()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <TopNavigation />
      
      <div className="p-4 pb-20">
        {/* 用户头部信息 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 border border-amber-200"
        >
          <div className="flex items-center space-x-4 mb-4">
            {/* 头像 */}
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.userName?.charAt(0) || 'U'}
            </div>
            
            {/* 用户信息 */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold text-amber-800">{user?.userName}</h1>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                >
                  <Edit size={16} />
                </motion.button>
              </div>
              <p className="text-amber-600 text-sm">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-amber-700">等级 {userLevel}</span>
                <span className="text-sm text-amber-600">经验 {userExperience}</span>
              </div>
            </div>
          </div>

          {/* 经验进度条 */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-amber-600 mb-1">
              <span>升级进度</span>
              <span>还需 {experienceToNextLevel} 经验</span>
            </div>
            <div className="bg-amber-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unlockedLocations.length}</div>
              <div className="text-xs text-amber-600">已解锁地点</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
              <div className="text-xs text-amber-600">完成任务</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{completedAchievements.length + completedDynamicAchievements.length}</div>
              <div className="text-xs text-amber-600">获得成就</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalNFTs}</div>
              <div className="text-xs text-amber-600">NFT收藏</div>
            </div>
          </div>
        </motion.div>

        {/* 标签页导航 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-amber-200"
        >
          {[
            { key: 'overview', label: '概览', icon: User },
            { key: 'history', label: '历史', icon: History },
            { key: 'achievements', label: '成就', icon: Trophy },
            { key: 'nfts', label: 'NFT收藏', icon: Star }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'overview' | 'history' | 'achievements' | 'nfts')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </motion.div>

        {/* 标签页内容 */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* 最近活动 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                <h2 className="font-bold text-amber-800 mb-4 flex items-center">
                  <Calendar size={20} className="mr-2" />
                  最近活动
                </h2>
                <div className="space-y-3">
                  {recentActivities.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-3 p-2 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <div className="text-lg">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-amber-800 text-sm">{activity.title}</p>
                        <p className="text-amber-500 text-xs">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 探索地图 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                <h2 className="font-bold text-amber-800 mb-4 flex items-center">
                  <MapPin size={20} className="mr-2" />
                  探索地图
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {unlockedLocations.slice(0, 4).map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-amber-50 rounded-lg p-3 border border-amber-200"
                    >
                      <div className="text-2xl mb-1">
                        {location.type === 'palace' ? '🏰' :
                         location.type === 'temple' ? '🏛️' :
                         location.type === 'garden' ? '🌸' :
                         location.type === 'mountain' ? '⛰️' :
                         location.type === 'river' ? '🌊' : '🏘️'}
                      </div>
                      <p className="text-amber-800 text-sm font-medium">{location.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200"
            >
              <h2 className="font-bold text-amber-800 mb-4">活动历史</h2>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                  >
                    <div className="text-xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-amber-800 font-medium">{activity.title}</p>
                      <p className="text-amber-500 text-sm">{activity.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'task' ? 'bg-green-100 text-green-800' :
                      activity.type === 'location' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {activity.type === 'task' ? '任务' :
                       activity.type === 'location' ? '探索' : '成就'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200"
            >
              <h2 className="font-bold text-amber-800 mb-4">我的成就</h2>
              <div className="grid gap-3">
                {completedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-800">{achievement.title}</h3>
                      <p className="text-amber-600 text-sm">{achievement.description}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Star size={16} />
                      <span className="text-sm font-medium">已获得</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'nfts' && (
            <motion.div
              key="nfts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                <h2 className="font-bold text-amber-800 mb-4 flex items-center">
                  <Star size={20} className="mr-2" />
                  NFT收藏 ({totalNFTs})
                </h2>
                
                {totalNFTs === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="text-amber-600 mb-2">还没有NFT收藏</p>
                    <p className="text-amber-500 text-sm">探索更多地点来收集NFT吧！</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {nfts.map((nft, index) => (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{nft.image}</div>
                          <h3 className="font-semibold text-purple-800 mb-1">{nft.name}</h3>
                          <p className="text-purple-600 text-xs mb-2">{nft.description}</p>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            nft.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                            nft.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                            nft.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {nft.rarity === 'legendary' ? '传说' :
                             nft.rarity === 'epic' ? '史诗' :
                             nft.rarity === 'rare' ? '稀有' : '普通'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProfilePage
