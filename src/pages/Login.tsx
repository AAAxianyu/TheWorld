
import React from 'react'
import { motion } from 'framer-motion'
import {MapPin, Compass, Crown} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const LoginPage: React.FC = () => {
  const { signIn, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-orange-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/5 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
      >
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Compass size={32} className="text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-2 font-serif"
            style={{ fontFamily: "'Ma Shan Zheng', cursive" }}
          >
            古风探索地图
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-amber-100 text-sm"
          >
            穿越时空，探索古代文明的奥秘
          </motion.p>
        </div>

        {/* 特色介绍 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 mb-8"
        >
          <div className="flex items-center text-amber-100">
            <MapPin size={20} className="mr-3 text-amber-400" />
            <span className="text-sm">探索历史名胜古迹</span>
          </div>
          <div className="flex items-center text-amber-100">
            <Crown size={20} className="mr-3 text-amber-400" />
            <span className="text-sm">体验古代宫廷文化</span>
          </div>
          <div className="flex items-center text-amber-100">
            <Compass size={20} className="mr-3 text-amber-400" />
            <span className="text-sm">完成历史探索任务</span>
          </div>
        </motion.div>

        {/* 登录按钮 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={signIn}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              正在登录...
            </div>
          ) : (
            '开始探索之旅'
          )}
        </motion.button>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-6"
        >
          <p className="text-amber-200 text-xs">
            探索古代文明 • 传承历史文化
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
