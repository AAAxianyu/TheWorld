import React, { useEffect, useState } from 'react'
import { Clock, Star, RefreshCw, Sparkles, Calendar, Cloud } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import toast from 'react-hot-toast'

interface DynamicTaskWidgetProps {
  className?: string
}

const DynamicTaskWidget: React.FC<DynamicTaskWidgetProps> = ({ className = '' }) => {
  const { 
    tasks, 
    environmentInfo, 
    generateDynamicTask, 
    removeExpiredDynamicTasks 
  } = useGameStore()
  const [generating, setGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)

  // 获取动态任务
  const dynamicTasks = tasks.filter(task => task.isDynamic && task.status !== 'completed')

  // 检查是否可以生成新任务（避免频繁生成）
  const canGenerateNewTask = () => {
    if (!lastGenerated) return true
    const now = new Date()
    const timeDiff = now.getTime() - lastGenerated.getTime()
    return timeDiff > 30 * 60 * 1000 // 30分钟内只能生成一次
  }

  // 生成新任务
  const handleGenerateTask = async () => {
    if (!canGenerateNewTask()) {
      toast.error('请稍后再试，任务生成有冷却时间')
      return
    }

    setGenerating(true)
    try {
      await generateDynamicTask()
      setLastGenerated(new Date())
      toast.success('新的限时任务已生成！')
    } catch (error) {
      toast.error('生成任务失败，请稍后重试')
    } finally {
      setGenerating(false)
    }
  }

  // 清理过期任务
  useEffect(() => {
    const interval = setInterval(() => {
      removeExpiredDynamicTasks()
    }, 60 * 1000) // 每分钟检查一次

    return () => clearInterval(interval)
  }, [removeExpiredDynamicTasks])

  // 格式化剩余时间
  const formatTimeRemaining = (timeLimit?: number, generatedAt?: Date) => {
    if (!timeLimit || !generatedAt) return '无限制'
    
    const now = new Date()
    const endTime = new Date(generatedAt.getTime() + timeLimit)
    const remaining = endTime.getTime() - now.getTime()
    
    if (remaining <= 0) return '已过期'
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}小时${minutes}分钟`
  }

  // 获取任务类型图标
  const getTaskTypeIcon = (task: any) => {
    if (task.festivalType) return <Calendar className="w-4 h-4 text-red-500" />
    if (task.weatherCondition) return <Cloud className="w-4 h-4 text-blue-500" />
    return <Sparkles className="w-4 h-4 text-purple-500" />
  }

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-lg ${className}`}>
      {/* 标题和生成按钮 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-bold text-gray-800">限时任务</h3>
        </div>
        <button
          onClick={handleGenerateTask}
          disabled={generating || !canGenerateNewTask()}
          className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? (
            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-1" />
          )}
          生成任务
        </button>
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {dynamicTasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无限时任务</p>
            <p className="text-xs mt-1">点击上方按钮生成新任务</p>
          </div>
        ) : (
          dynamicTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg p-3 border border-purple-200 hover:shadow-md transition-shadow"
            >
              {/* 任务头部 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center flex-1">
                  {getTaskTypeIcon(task)}
                  <h4 className="text-sm font-medium text-gray-800 ml-2 flex-1">
                    {task.title}
                  </h4>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeRemaining(task.timeLimit, task.generatedAt)}
                </div>
              </div>

              {/* 任务描述 */}
              <p className="text-xs text-gray-600 mb-2">{task.description}</p>

              {/* 任务标签 */}
              <div className="flex items-center space-x-2 mb-2">
                {task.festivalType && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    {task.festivalType}
                  </span>
                )}
                {task.weatherCondition && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {task.weatherCondition}
                  </span>
                )}
              </div>

              {/* 奖励信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  <span>{task.reward}</span>
                </div>
                <div className="text-xs text-purple-600 font-medium">
                  {task.status === 'not_started' ? '未开始' : 
                   task.status === 'in_progress' ? '进行中' : '已完成'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 环境信息提示 */}
      {environmentInfo.festival && (
        <div className="mt-3 p-2 bg-red-50 rounded-md border border-red-200">
          <div className="text-xs text-red-700">
            🎉 检测到{environmentInfo.festival}，系统将生成相关节日任务
          </div>
        </div>
      )}
    </div>
  )
}

export default DynamicTaskWidget

