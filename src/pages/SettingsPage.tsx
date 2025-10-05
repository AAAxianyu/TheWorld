
import React from 'react'
import { motion } from 'framer-motion'
import {Volume2, VolumeX, Music, Sun, Moon, Eye, EyeOff, Save, ArrowLeft} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'
import toast from 'react-hot-toast'

const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { settings, updateSettings } = useGameStore()

  const handleToggleSetting = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value })
    
    const messages = {
      soundEnabled: value ? '音效已开启' : '音效已关闭',
      musicEnabled: value ? '背景音乐已开启' : '背景音乐已关闭',
      theme: value === 'dark' ? '已切换到暗黑模式' : '已切换到明亮模式',
      showLocation: value ? '位置显示已开启' : '位置显示已关闭'
    }
    
    toast.success(messages[key], {
      duration: 2000,
      icon: '⚙️'
    })
  }

  const handleSaveSettings = () => {
    toast.success('设置已保存！', {
      duration: 2000,
      icon: '✅'
    })
  }

  const settingGroups = [
    {
      title: '音频设置',
      icon: '🔊',
      settings: [
        {
          key: 'soundEnabled' as const,
          label: '音效',
          description: '开启或关闭游戏音效',
          type: 'toggle',
          value: settings.soundEnabled,
          icons: { on: Volume2, off: VolumeX }
        },
        {
          key: 'musicEnabled' as const,
          label: '背景音乐',
          description: '开启或关闭背景音乐',
          type: 'toggle',
          value: settings.musicEnabled,
          icons: { on: Music, off: VolumeX }
        }
      ]
    },
    {
      title: '显示设置',
      icon: '🎨',
      settings: [
        {
          key: 'theme' as const,
          label: '主题模式',
          description: '选择明亮或暗黑主题',
          type: 'theme',
          value: settings.theme,
          icons: { light: Sun, dark: Moon }
        }
      ]
    },
    {
      title: '隐私设置',
      icon: '🔒',
      settings: [
        {
          key: 'showLocation' as const,
          label: '显示位置',
          description: '在社交功能中显示您的探索地点',
          type: 'toggle',
          value: settings.showLocation,
          icons: { on: Eye, off: EyeOff }
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <TopNavigation />
      
      <div className="p-4 pb-20">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-amber-700 hover:bg-amber-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-amber-800 font-serif">设置</h1>
            <p className="text-amber-600">个性化您的古风探索体验</p>
          </div>
        </motion.div>

        {/* 设置组 */}
        <div className="space-y-6">
          {settingGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * groupIndex }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200"
            >
              <h2 className="font-bold text-amber-800 mb-4 flex items-center">
                <span className="text-xl mr-2">{group.icon}</span>
                {group.title}
              </h2>

              <div className="space-y-4">
                {group.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * settingIndex }}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-amber-800">{setting.label}</h3>
                      <p className="text-amber-600 text-sm">{setting.description}</p>
                    </div>

                    <div className="ml-4">
                      {setting.type === 'toggle' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleSetting(setting.key, !setting.value)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            setting.value ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: setting.value ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                          >
                            {setting.value ? (
                              React.createElement((setting.icons as any).on, { size: 12, className: "text-green-600" })
                            ) : (
                              React.createElement((setting.icons as any).off, { size: 12, className: "text-gray-600" })
                            )}
                          </motion.div>
                        </motion.button>
                      )}

                      {setting.type === 'theme' && (
                        <div className="flex space-x-2">
                          {(['light', 'dark'] as const).map((theme) => {
                            const Icon = setting.icons[theme as keyof typeof setting.icons]
                            const isActive = setting.value === theme
                            
                            return (
                              <motion.button
                                key={theme}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleToggleSetting(setting.key, theme)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-white text-amber-700 hover:bg-amber-100'
                                }`}
                              >
                                {React.createElement(Icon, { size: 20 })}
                              </motion.button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 保存按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>保存设置</span>
          </motion.button>
        </motion.div>

        {/* 版本信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-amber-500 text-sm"
        >
          <p>古风探索地图 v1.0.0</p>
          <p>© 2024 穿越时空的历史探险</p>
        </motion.div>
      </div>
    </div>
  )
}

export default SettingsPage
