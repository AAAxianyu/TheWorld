import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Trophy, Users, PenTool } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import WestLakePoetryTaskComponent from '../components/WestLakePoetryTask'
import { TaskStage, TaskStatus } from '../services/westLakePoetryTask'

const WestLakePoetryTestPage: React.FC = () => {
  const { westLakePoetryTask, updateWestLakePoetryTask, startWestLakePoetryTask, resetWestLakePoetryTask } = useGameStore()
  const [showTask, setShowTask] = useState(false)

  const handleStartTask = () => {
    startWestLakePoetryTask()
    setShowTask(true)
  }

  const handleTaskUpdate = (updatedTask: any) => {
    updateWestLakePoetryTask(updatedTask)
  }

  const handleCloseTask = () => {
    setShowTask(false)
  }

  const getStageStatus = (stage: TaskStage) => {
    const stageData = westLakePoetryTask.stages[stage]
    return {
      status: stageData.status,
      progress: stageData.progress,
      maxProgress: stageData.maxProgress,
      unlocked: stageData.status !== TaskStatus.LOCKED
    }
  }

  const poetryRiddleStatus = getStageStatus(TaskStage.POETRY_RIDDLE)
  const poetExplorationStatus = getStageStatus(TaskStage.POET_EXPLORATION)
  const poetryCreationStatus = getStageStatus(TaskStage.POETRY_CREATION)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-blue-800 mb-4">西湖诗词创作任务</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            通过AI互动式问答与创作，了解西湖相关的诗词、诗人及文化背景。
            完成三个阶段后，将解锁更多西湖相关的探索任务。
          </p>
        </motion.div>

        {/* 任务概览 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">任务进度</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 第一阶段：诗句接龙 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-lg border-2 transition-all ${
                poetryRiddleStatus.unlocked 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-4">
                <BookOpen className={`w-8 h-8 mr-3 ${
                  poetryRiddleStatus.unlocked ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">诗句接龙</h3>
                  <p className="text-sm text-gray-600">测试诗词认知</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>进度</span>
                  <span>{poetryRiddleStatus.progress}/{poetryRiddleStatus.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(poetryRiddleStatus.progress / poetryRiddleStatus.maxProgress) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  状态: {poetryRiddleStatus.status === TaskStatus.COMPLETED ? '已完成' : 
                        poetryRiddleStatus.status === TaskStatus.IN_PROGRESS ? '进行中' : '未开始'}
                </div>
              </div>
            </motion.div>

            {/* 第二阶段：诗人探索 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-lg border-2 transition-all ${
                poetExplorationStatus.unlocked 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-4">
                <Users className={`w-8 h-8 mr-3 ${
                  poetExplorationStatus.unlocked ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">诗人探索</h3>
                  <p className="text-sm text-gray-600">对话了解诗人</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>进度</span>
                  <span>{poetExplorationStatus.progress}/{poetExplorationStatus.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(poetExplorationStatus.progress / poetExplorationStatus.maxProgress) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  状态: {poetExplorationStatus.status === TaskStatus.COMPLETED ? '已完成' : 
                        poetExplorationStatus.status === TaskStatus.IN_PROGRESS ? '进行中' : 
                        poetExplorationStatus.status === TaskStatus.LOCKED ? '已锁定' : '未开始'}
                </div>
              </div>
            </motion.div>

            {/* 第三阶段：诗词创作 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-lg border-2 transition-all ${
                poetryCreationStatus.unlocked 
                  ? 'border-purple-300 bg-purple-50' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-4">
                <PenTool className={`w-8 h-8 mr-3 ${
                  poetryCreationStatus.unlocked ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">诗词创作</h3>
                  <p className="text-sm text-gray-600">AI引导创作</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>进度</span>
                  <span>{poetryCreationStatus.progress}/{poetryCreationStatus.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(poetryCreationStatus.progress / poetryCreationStatus.maxProgress) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  状态: {poetryCreationStatus.status === TaskStatus.COMPLETED ? '已完成' : 
                        poetryCreationStatus.status === TaskStatus.IN_PROGRESS ? '进行中' : 
                        poetryCreationStatus.status === TaskStatus.LOCKED ? '已锁定' : '未开始'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 奖励展示 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">当前奖励</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-bold text-yellow-700">诗心值</div>
              <div className="text-2xl font-bold text-yellow-600">{westLakePoetryTask.rewards.poetryValue}</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="font-bold text-blue-700">文化积分</div>
              <div className="text-2xl font-bold text-blue-600">{westLakePoetryTask.rewards.culturePoints}</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="font-bold text-green-700">诗意之门</div>
              <div className="text-lg font-bold text-green-600">
                {westLakePoetryTask.rewards.poetryDoor ? '✅' : '❌'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="font-bold text-purple-700">西湖徽章</div>
              <div className="text-lg font-bold text-purple-600">
                {westLakePoetryTask.rewards.westLakeBadge ? '✅' : '❌'}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="text-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTask}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg"
          >
            开始任务
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetWestLakePoetryTask}
            className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold text-lg"
          >
            重置任务
          </motion.button>
        </div>

        {/* 任务完成后的新任务提示 */}
        {westLakePoetryTask.completedAt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">🎉 恭喜完成西湖诗词创作任务！</h3>
            <p className="text-lg mb-4">现在你可以探索更多西湖相关的文化任务：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-bold mb-2">西湖边的茶文化</h4>
                <p className="text-sm">探索龙井茶的制作工艺和品茶文化</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-bold mb-2">西湖边的建筑艺术</h4>
                <p className="text-sm">了解雷峰塔、断桥等古建筑的历史</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-bold mb-2">西湖边的民间传说</h4>
                <p className="text-sm">聆听白蛇传等经典民间故事</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="font-bold mb-2">西湖边的美食文化</h4>
                <p className="text-sm">品尝西湖醋鱼等传统美食</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 任务弹窗 */}
      {showTask && (
        <WestLakePoetryTaskComponent
          task={westLakePoetryTask}
          onTaskUpdate={handleTaskUpdate}
          onClose={handleCloseTask}
        />
      )}
    </div>
  )
}

export default WestLakePoetryTestPage
