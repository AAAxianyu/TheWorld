
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Users, UserPlus, MessageCircleDashed as MessageCircle, Trophy, Clock, Search, Send, Star} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'
import toast from 'react-hot-toast'

const SocialPage: React.FC = () => {
  const { friends, addFriend, tasks, generateDynamicAchievement } = useGameStore()
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const handleViewFriend = (friendId: string) => {
    setSelectedFriend(friendId)
  }

  const handleShareTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      toast.success(`已分享任务"${task.title}"给好友！`, {
        duration: 2000,
        icon: '📤'
      })
      
      // 生成动态成就
      generateDynamicAchievement({
        tasksCompleted: 1,
        specialEvents: ['task_sharing']
      })
    }
  }

  const handleCollaborateTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      toast.success(`已邀请好友合作完成"${task.title}"！`, {
        duration: 2000,
        icon: '🤝'
      })
    }
  }

  const handleAddFriend = () => {
    if (!inviteEmail.trim()) {
      toast.error('请输入好友的用户名', {
        duration: 2000,
        icon: '❌'
      })
      return
    }
    
    // 检查是否已经是好友
    const existingFriend = friends.find(f => f.userName === inviteEmail.trim())
    if (existingFriend) {
      toast.error('该用户已经是您的好友', {
        duration: 2000,
        icon: '❌'
      })
      return
    }
    
    const newFriend = {
      id: `friend_${Date.now()}`,
      userName: inviteEmail.trim(),
      avatar: '👤',
      level: Math.floor(Math.random() * 10) + 1,
      lastActive: '刚刚',
      achievements: Math.floor(Math.random() * 20),
      tasksCompleted: Math.floor(Math.random() * 50)
    }
    
    addFriend(newFriend)
    toast.success(`成功添加好友：${inviteEmail.trim()}！`, {
      duration: 2000,
      icon: '🎉'
    })
    
    // 清空输入框并关闭弹窗
    setInviteEmail('')
    setShowInviteModal(false)
  }

  const selectedFriendData = friends.find(f => f.id === selectedFriend)

  const getLevelColor = (level: number) => {
    if (level >= 15) return 'text-purple-600'
    if (level >= 10) return 'text-blue-600'
    if (level >= 5) return 'text-green-600'
    return 'text-amber-600'
  }

  const getActivityStatus = (lastActive: string) => {
    if (lastActive === '刚刚' || lastActive.includes('分钟前')) {
      return { color: 'bg-green-500', text: '在线' }
    }
    if (lastActive.includes('小时前')) {
      return { color: 'bg-yellow-500', text: '离开' }
    }
    return { color: 'bg-gray-400', text: '离线' }
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
          <h1 className="text-3xl font-bold text-amber-800 font-serif mb-2">社交大厅</h1>
          <p className="text-amber-600">与好友一起探索古代文明</p>
        </motion.div>

        {/* 社交统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{friends.length}</div>
            <div className="text-sm text-amber-600">好友总数</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-200">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {friends.filter(f => f.lastActive === '刚刚' || f.lastActive.includes('分钟前')).length}
            </div>
            <div className="text-sm text-amber-600">在线好友</div>
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-3 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInviteModal(true)}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Send size={18} />
            <span>邀请好友</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddFriend}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <UserPlus size={18} />
            <span>添加好友</span>
          </motion.button>
        </motion.div>

        {/* 好友列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="font-bold text-amber-800 text-lg">好友列表</h2>
          
          {friends.map((friend, index) => {
            const activityStatus = getActivityStatus(friend.lastActive)
            
            return (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  {/* 头像和状态 */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {friend.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${activityStatus.color} rounded-full border-2 border-white`} />
                  </div>

                  {/* 好友信息 */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-amber-800">{friend.userName}</h3>
                      <span className={`text-sm font-medium ${getLevelColor(friend.level)}`}>
                        Lv.{friend.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-amber-600">
                      <div className="flex items-center space-x-1">
                        <Trophy size={12} />
                        <span>{friend.achievements} 成就</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={12} />
                        <span>{friend.tasksCompleted} 任务</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-amber-500 mt-1">
                      {activityStatus.text} • {friend.lastActive}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewFriend(friend.id)}
                      className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                    >
                      <Search size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      <MessageCircle size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {friends.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">👥</div>
            <p className="text-amber-600 mb-2">还没有好友</p>
            <p className="text-amber-500 text-sm">邀请朋友一起探索古代文明吧！</p>
          </motion.div>
        )}
      </div>

      {/* 邀请好友弹窗 */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
               <h2 className="text-xl font-bold text-amber-800 mb-4 text-center">添加好友</h2>
               
               <div className="mb-4">
                 <label className="block text-amber-700 text-sm font-medium mb-2">
                   好友用户名
                 </label>
                 <input
                   type="text"
                   value={inviteEmail}
                   onChange={(e) => setInviteEmail(e.target.value)}
                   placeholder="输入好友的用户名"
                   className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                 />
               </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  取消
                </button>
                 <button
                   onClick={handleAddFriend}
                   className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                 >
                   添加好友
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 好友详情弹窗 */}
      <AnimatePresence>
        {selectedFriend && selectedFriendData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFriend(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedFriendData.avatar}
                </div>
                <h2 className="text-2xl font-bold text-amber-800">{selectedFriendData.userName}</h2>
                <p className="text-amber-600">等级 {selectedFriendData.level}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedFriendData.achievements}</div>
                  <div className="text-sm text-amber-600">获得成就</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedFriendData.tasksCompleted}</div>
                  <div className="text-sm text-amber-600">完成任务</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-amber-800">最近活动</h3>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-amber-700 text-sm">完成了"探索紫禁城"任务</p>
                  <p className="text-amber-500 text-xs">2小时前</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-amber-700 text-sm">解锁了"天坛"地点</p>
                  <p className="text-amber-500 text-xs">1天前</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-amber-800">社交互动</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShareTask('explore_throne_room')}
                    className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-1"
                  >
                    <span>📤</span>
                    <span>分享任务</span>
                  </button>
                  <button
                    onClick={() => handleCollaborateTask('explore_throne_room')}
                    className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center space-x-1"
                  >
                    <span>🤝</span>
                    <span>合作任务</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setSelectedFriend(null)}
                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors"
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

export default SocialPage
