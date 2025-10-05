
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Star, Clock, Users, TestTube} from 'lucide-react'
import TopNavigation from '../components/TopNavigation'
import { useGameStore } from '../store/gameStore'
import { AmapService, DeepSeekService, VirtualLifeService } from '../services/api'
import toast from 'react-hot-toast'

type Task = {
  id: string
  title: string
  description: string
  status: 'not_started' | 'in_progress' | 'completed' | 'expired'
  progress: number
  maxProgress: number
  reward: string
  timeLimit?: number
  locationId: string
  type: 'exploration' | 'knowledge' | 'social' | 'collection' | 'limited_time'
  startTime?: number
  endTime?: number
  isLimitedTime?: boolean
  weatherCondition?: string
  festivalType?: string
}

const HomePage: React.FC = () => {
  const { 
    locations, 
    tasks, 
    events, 
    unlockLocation, 
    updateTaskProgress,
    updateTime,
    checkLimitedTimeTasks,
    startLimitedTimeTask,
    generateNFT
  } = useGameStore()
  
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showEventNotification, setShowEventNotification] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [currentCity, setCurrentCity] = useState<string | null>(null) // 当前查看的城市
  const [testingApis, setTestingApis] = useState(false)
  const [testResults, setTestResults] = useState<any>({})
  const [envStatus, setEnvStatus] = useState<any>(null)

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      updateTime()
      checkLimitedTimeTasks()
    }, 60000) // 每分钟更新一次
    return () => clearInterval(timer)
  }, [updateTime, checkLimitedTimeTasks])

  // 页面加载时自动检查环境变量
  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

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

  // 环境变量检查函数
  const checkEnvironmentVariables = () => {
    const amapKey = import.meta.env.VITE_AMAP_API_KEY
    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY
    
    const status = {
      amap: {
        configured: !!(amapKey && amapKey !== 'your_amap_api_key'),
        value: amapKey ? `${amapKey.substring(0, 8)}...` : '未配置',
        status: amapKey && amapKey !== 'your_amap_api_key' ? 'success' : 'error'
      },
      deepseek: {
        configured: !!(deepseekKey && deepseekKey !== 'your_deepseek_api_key'),
        value: deepseekKey ? `${deepseekKey.substring(0, 8)}...` : '未配置',
        status: deepseekKey && deepseekKey !== 'your_deepseek_api_key' ? 'success' : 'error'
      }
    }
    
    setEnvStatus(status)
    console.log('🔍 环境变量检查结果:', status)
    
    // 显示检查结果
    const allConfigured = status.amap.configured && status.deepseek.configured
    if (allConfigured) {
      toast.success('环境变量配置正确', { icon: '✅' })
    } else {
      toast.error('环境变量配置不完整', { icon: '⚠️' })
    }
  }

  // API测试函数
  const testApis = async () => {
    setTestingApis(true)
    const results: any = {}

    try {
      // 测试1: IP定位
      console.log('📍 测试IP定位...')
      const location = await AmapService.getLocationByIP()
      results.ipLocation = location
      toast.success('IP定位测试成功')
    } catch (error) {
      console.error('IP定位失败:', error)
      results.ipLocation = { error: (error as Error).message }
      toast.error('IP定位测试失败')
    }

    try {
      // 测试2: 天气查询
      console.log('🌤️ 测试天气查询...')
      const location = await AmapService.getLocationByIP()
      const weather = await AmapService.getWeatherInfo(location.adcode)
      results.weather = {
        city: weather.lives[0]?.city,
        weather: weather.lives[0]?.weather,
        temperature: weather.lives[0]?.temperature
      }
      toast.success('天气查询测试成功')
    } catch (error) {
      console.error('天气查询失败:', error)
      results.weather = { error: (error as Error).message }
      toast.error('天气查询测试失败')
    }

    try {
      // 测试3: DeepSeek AI任务生成
      console.log('🤖 测试DeepSeek AI...')
      const mockWeather = {
        province: '北京市',
        city: '北京市',
        weather: '晴',
        temperature: '25',
        winddirection: '南风',
        windpower: '3级',
        humidity: '60%',
        reporttime: new Date().toISOString()
      }
      
      const task = await DeepSeekService.generateTask(mockWeather, '国庆节')
      results.aiTask = task
      toast.success('DeepSeek AI测试成功')
    } catch (error) {
      console.error('AI任务生成失败:', error)
      results.aiTask = { error: (error as Error).message }
      toast.error('DeepSeek AI测试失败')
    }

    try {
      // 测试4: 完整流程
      console.log('🔄 测试完整流程...')
      const envInfo = await VirtualLifeService.getEnvironmentInfo()
      const dynamicTask = await VirtualLifeService.generateDynamicTask()
      results.fullFlow = {
        environment: {
          location: envInfo.location.city,
          weather: envInfo.weather.weather,
          temperature: envInfo.weather.temperature,
          festival: envInfo.festival,
          season: envInfo.season
        },
        task: dynamicTask
      }
      toast.success('完整流程测试成功')
    } catch (error) {
      console.error('完整流程失败:', error)
      results.fullFlow = { error: (error as Error).message }
      toast.error('完整流程测试失败')
    }

    setTestResults(results)
    setTestingApis(false)
    console.log('🎉 API测试完成:', results)
  }

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

  const getTaskTimeRemaining = (task: Task) => {
    if (!task.isLimitedTime || !task.endTime) return null
    
    const remaining = task.endTime - Date.now()
    if (remaining <= 0) return null
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    return { hours, minutes, total: remaining }
  }

  const handleLocationClick = (locationId: string) => {
    const location = locations.find(l => l.id === locationId)
    if (!location) return

    if (!location.unlocked) {
      // 解锁地点
      unlockLocation(locationId)
      generateNFT(locationId, {
        weatherCondition: 'sunny',
        specialEvent: 'first_exploration'
      })
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

    if (task.status === 'expired') {
      toast.error('此任务已过期', {
        duration: 2000,
        icon: '⏰'
      })
      return
    }
    
    if (task.status === 'not_started') {
      if (task.isLimitedTime) {
        startLimitedTimeTask(taskId)
        toast.success(`开始限时任务：${task.title}`, {
          duration: 2000,
          icon: '⏰'
        })
      } else {
        updateTaskProgress(taskId, 1)
        toast.success(`开始任务：${task.title}`, {
          duration: 2000,
          icon: '🎯'
        })
      }
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
       
       {/* API测试按钮 */}
       <div className="p-4 pb-2">
         <div className="flex items-center justify-between">
           <h1 className="text-2xl font-bold text-amber-800 font-serif">古风探索世界</h1>
           <div className="flex space-x-2">
             <button
               onClick={checkEnvironmentVariables}
               className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
             >
               <TestTube className="w-4 h-4 mr-1" />
               检查配置
             </button>
             <button
               onClick={testApis}
               disabled={testingApis}
               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
             >
               <TestTube className="w-4 h-4 mr-2" />
               {testingApis ? '测试中...' : '测试API'}
             </button>
           </div>
         </div>
       </div>

       {/* 环境变量状态 */}
       {envStatus && (
         <div className="mx-4 mb-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-green-200">
           <h3 className="text-lg font-semibold text-green-800 mb-3">环境变量配置状态</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className={`p-3 rounded-lg ${envStatus.amap.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
               <div className="flex items-center justify-between">
                 <span className="font-medium text-gray-700">高德地图API</span>
                 <span className={`text-sm ${envStatus.amap.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                   {envStatus.amap.status === 'success' ? '✅ 已配置' : '❌ 未配置'}
                 </span>
               </div>
               <p className="text-xs text-gray-500 mt-1">密钥: {envStatus.amap.value}</p>
             </div>
             <div className={`p-3 rounded-lg ${envStatus.deepseek.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
               <div className="flex items-center justify-between">
                 <span className="font-medium text-gray-700">DeepSeek API</span>
                 <span className={`text-sm ${envStatus.deepseek.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                   {envStatus.deepseek.status === 'success' ? '✅ 已配置' : '❌ 未配置'}
                 </span>
               </div>
               <p className="text-xs text-gray-500 mt-1">密钥: {envStatus.deepseek.value}</p>
             </div>
           </div>
           {envStatus.amap.configured && envStatus.deepseek.configured ? (
             <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-700">
               🎉 所有API密钥已正确配置，可以开始测试！
             </div>
           ) : (
             <div className="mt-3 p-2 bg-yellow-100 rounded text-sm text-yellow-700">
               ⚠️ 请检查 .env.local 文件中的API密钥配置
             </div>
           )}
         </div>
       )}

       {/* 测试结果 */}
       {Object.keys(testResults).length > 0 && (
         <div className="mx-4 mb-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
           <h3 className="text-lg font-semibold text-blue-800 mb-3">API测试结果</h3>
           <div className="space-y-2 text-sm">
             {testResults.ipLocation && (
               <div className="p-2 bg-gray-50 rounded">
                 <strong>📍 IP定位:</strong> {testResults.ipLocation.error || `${testResults.ipLocation.city}, ${testResults.ipLocation.province}`}
               </div>
             )}
             {testResults.weather && (
               <div className="p-2 bg-gray-50 rounded">
                 <strong>🌤️ 天气查询:</strong> {testResults.weather.error || `${testResults.weather.city} ${testResults.weather.weather} ${testResults.weather.temperature}°C`}
               </div>
             )}
             {testResults.aiTask && (
               <div className="p-2 bg-gray-50 rounded">
                 <strong>🤖 AI任务:</strong> {testResults.aiTask.error || testResults.aiTask.title}
               </div>
             )}
             {testResults.fullFlow && (
               <div className="p-2 bg-gray-50 rounded">
                 <strong>🔄 完整流程:</strong> {testResults.fullFlow.error || '成功生成动态任务'}
               </div>
             )}
           </div>
         </div>
       )}
       
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
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : task.status === 'expired'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status === 'completed' ? '已完成' :
                               task.status === 'in_progress' ? '进行中' : 
                               task.status === 'expired' ? '已过期' : '未开始'}
                            </span>
                            {task.isLimitedTime && getTaskTimeRemaining(task) && (
                              <span className="text-xs text-orange-600 font-medium">
                                ⏰ {getTaskTimeRemaining(task)?.hours}时{getTaskTimeRemaining(task)?.minutes}分
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-amber-600 text-sm mb-2">{task.description}</p>
                         <div className="flex justify-between items-center">
                           <span className="text-xs text-amber-500">奖励: {task.reward}</span>
                           <div className="flex space-x-2">
                             <button
                               onClick={() => setSelectedTask(task.id)}
                               className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition-colors"
                             >
                               查看详情
                             </button>
                             {task.status === 'not_started' && (
                               <button
                                 onClick={() => handleStartTask(task.id)}
                                 className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs hover:bg-amber-700 transition-colors"
                               >
                                 开始任务
                               </button>
                             )}
                           </div>
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

       {/* 任务详情弹窗 */}
       <AnimatePresence>
         {selectedTask && (() => {
           const task = tasks.find(t => t.id === selectedTask)
           const location = locations.find(l => l.id === task?.locationId)
           return task && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
               onClick={() => setSelectedTask(null)}
             >
               <motion.div
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.8, opacity: 0 }}
                 className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                 onClick={(e) => e.stopPropagation()}
               >
                 <div className="text-center mb-6">
                   <div className="text-4xl mb-2">
                     {getLocationIcon(location?.type || '')}
                   </div>
                   <h2 className="text-2xl font-bold text-amber-800 font-serif mb-2">
                     {task.title}
                   </h2>
                   <p className="text-amber-600 text-sm">
                     地点：{location?.name}
                   </p>
                   {task.isLimitedTime && getTaskTimeRemaining(task) && (
                     <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                       <div className="text-orange-800 font-semibold text-lg">
                         ⏰ 剩余时间：{getTaskTimeRemaining(task)?.hours}小时{getTaskTimeRemaining(task)?.minutes}分钟
                       </div>
                       <div className="text-orange-600 text-sm">
                         限时任务，请尽快完成！
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="mb-6">
                   <h3 className="font-semibold text-amber-800 mb-3">任务描述</h3>
                   <p className="text-amber-700 text-sm leading-relaxed mb-3">
                     {task.description}
                   </p>
                   
                   {task.detailedDescription && (
                     <div className="bg-blue-50 rounded-lg p-3 mb-3">
                       <h4 className="font-medium text-blue-800 mb-2">📖 详细描述</h4>
                       <p className="text-blue-700 text-sm leading-relaxed">
                         {task.detailedDescription}
                       </p>
                     </div>
                   )}
                   
                   {task.specificTarget && (
                     <div className="bg-green-50 rounded-lg p-3 mb-3">
                       <h4 className="font-medium text-green-800 mb-2">🎯 具体目标</h4>
                       <p className="text-green-700 text-sm leading-relaxed">
                         {task.specificTarget}
                       </p>
                     </div>
                   )}
                   
                   {task.historicalContext && (
                     <div className="bg-purple-50 rounded-lg p-3">
                       <h4 className="font-medium text-purple-800 mb-2">🏛️ 历史背景</h4>
                       <p className="text-purple-700 text-sm leading-relaxed">
                         {task.historicalContext}
                       </p>
                     </div>
                   )}
                 </div>

                 {/* 个性化导游指引 */}
                 <div className="mb-6">
                   <h3 className="font-semibold text-amber-800 mb-3">导游指引</h3>
                   {location?.guideInfo ? (
                     <div className="bg-amber-50 rounded-lg p-4">
                       <div className="space-y-4">
                         <div>
                           <h4 className="font-medium text-amber-800 mb-2">📍 探索路线</h4>
                           <ul className="text-amber-700 text-sm space-y-1">
                             {location.guideInfo.explorationTips.map((tip, index) => (
                               <li key={index} className="flex items-start">
                                 <span className="text-amber-600 mr-2">•</span>
                                 <span>{tip}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                         
                         <div>
                           <h4 className="font-medium text-amber-800 mb-2">⭐ 重点景点</h4>
                           <ul className="text-amber-700 text-sm space-y-1">
                             {location.guideInfo.highlights.map((highlight, index) => (
                               <li key={index} className="flex items-start">
                                 <span className="text-amber-600 mr-2">•</span>
                                 <span>{highlight}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <h4 className="font-medium text-amber-800 mb-2">⏰ 最佳时间</h4>
                             <p className="text-amber-700 text-sm">{location.guideInfo.bestTime}</p>
                           </div>
                           <div>
                             <h4 className="font-medium text-amber-800 mb-2">⏱️ 建议时长</h4>
                             <p className="text-amber-700 text-sm">{location.guideInfo.duration}</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div className="bg-amber-50 rounded-lg p-4">
                       <div className="space-y-3">
                         <div>
                           <h4 className="font-medium text-amber-800 mb-2">📍 探索路线</h4>
                           <p className="text-amber-700 text-sm">
                             建议从{location?.name}的主入口开始，按照历史时间线顺序参观各个重要景点。
                           </p>
                         </div>
                         <div>
                           <h4 className="font-medium text-amber-800 mb-2">⏰ 最佳时间</h4>
                           <p className="text-amber-700 text-sm">
                             建议在上午9:00-11:00或下午2:00-4:00进行探索，避开人流高峰。
                           </p>
                         </div>
                         <div>
                           <h4 className="font-medium text-amber-800 mb-2">🎯 重点观察</h4>
                           <p className="text-amber-700 text-sm">
                             注意观察建筑细节、历史文物和文化内涵，这些都是完成任务的关键。
                           </p>
                         </div>
                         <div>
                           <h4 className="font-medium text-amber-800 mb-2">📚 学习建议</h4>
                           <p className="text-amber-700 text-sm">
                             可以租借语音导览器或下载相关APP，深入了解历史文化背景。
                           </p>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="mb-6">
                   <h3 className="font-semibold text-amber-800 mb-3">任务信息</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-blue-50 rounded-lg p-3">
                       <div className="text-sm text-blue-600 mb-1">任务类型</div>
                       <div className="font-medium text-blue-800">
                         {task.type === 'exploration' ? '探索类' :
                          task.type === 'knowledge' ? '知识类' :
                          task.type === 'social' ? '社交类' : '收集类'}
                       </div>
                     </div>
                     <div className="bg-green-50 rounded-lg p-3">
                       <div className="text-sm text-green-600 mb-1">奖励</div>
                       <div className="font-medium text-green-800">{task.reward}</div>
                     </div>
                   </div>
                 </div>

                 <div className="flex space-x-3">
                   <button
                     onClick={() => setSelectedTask(null)}
                     className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                   >
                     关闭
                   </button>
                   {task.status === 'not_started' && (
                     <button
                       onClick={() => {
                         handleStartTask(task.id)
                         setSelectedTask(null)
                       }}
                       className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
                     >
                       开始任务
                     </button>
                   )}
                 </div>
               </motion.div>
             </motion.div>
           )
         })()}
       </AnimatePresence>
     </div>
   )
 }
 
 export default HomePage
