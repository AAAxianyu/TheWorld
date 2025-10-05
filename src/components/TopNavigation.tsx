
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {Settings, Clock, User} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useGameStore } from '../store/gameStore'

const TopNavigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const { userLevel, userExperience, currentTime } = useGameStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const experienceToNextLevel = (userLevel * 1000) - (userExperience % 1000)
  const progressPercentage = ((userExperience % 1000) / 1000) * 100

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-amber-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* 用户信息 */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
            >
              {user?.userName?.charAt(0) || 'U'}
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 left-0 bg-white rounded-lg shadow-xl border border-amber-200 py-2 w-48 z-50"
                >
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-amber-800 hover:bg-amber-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="mr-2" />
                    个人资料
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-amber-800 hover:bg-amber-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="mr-2" />
                    设置
                  </Link>
                  <hr className="my-1 border-amber-200" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      signOut()
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    退出登录
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <p className="font-semibold text-amber-800">{user?.userName}</p>
            <p className="text-xs text-amber-600">等级 {userLevel}</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="flex-1 mx-4">
          <div className="bg-amber-100 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
            />
          </div>
          <p className="text-xs text-amber-600 mt-1 text-center">
            距离下一级还需 {experienceToNextLevel} 经验
          </p>
        </div>

        {/* 时间和设置 */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-amber-700">
            <Clock size={16} className="mr-1" />
            <span className="text-sm font-mono">{formatTime(currentTime)}</span>
          </div>
          
          <Link to="/settings">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-amber-700 hover:bg-amber-100 rounded-full transition-colors"
            >
              <Settings size={20} />
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default TopNavigation
