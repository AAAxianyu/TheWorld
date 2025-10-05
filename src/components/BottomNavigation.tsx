
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Home, List, Trophy, Calendar, Users} from 'lucide-react'
import { motion } from 'framer-motion'

const BottomNavigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: '地图' },
    { path: '/tasks', icon: List, label: '任务' },
    { path: '/achievements', icon: Trophy, label: '成就' },
    { path: '/events', icon: Calendar, label: '事件' },
    { path: '/social', icon: Users, label: '社交' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-amber-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center py-2 px-3"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full transition-colors ${
                  isActive 
                    ? 'bg-amber-600 text-white' 
                    : 'text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Icon size={20} />
              </motion.div>
              <span className={`text-xs mt-1 ${
                isActive ? 'text-amber-800 font-medium' : 'text-amber-600'
              }`}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
