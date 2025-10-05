import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Users, PenTool, Star, CheckCircle, Lock } from 'lucide-react'
import { 
  WestLakePoetryTask, 
  TaskStage, 
  TaskStatus, 
  PoetryRiddle, 
  Poet, 
  PoetryTheme,
  UserPoetry,
  AI_CHARACTERS 
} from '../services/westLakePoetryTask'
import toast from 'react-hot-toast'

interface WestLakePoetryTaskProps {
  task: WestLakePoetryTask
  onTaskUpdate: (updatedTask: WestLakePoetryTask) => void
  onClose: () => void
}

const WestLakePoetryTaskComponent: React.FC<WestLakePoetryTaskProps> = ({
  task,
  onTaskUpdate,
  onClose
}) => {
  const [currentStage, setCurrentStage] = useState<TaskStage>(task.currentStage)
  const [userAnswer, setUserAnswer] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [showAI, setShowAI] = useState(false)

  // 同步currentStage状态
  useEffect(() => {
    setCurrentStage(task.currentStage)
  }, [task.currentStage])

  // AI角色
  const yinFeng = AI_CHARACTERS.yin_feng

  // 获取当前阶段的问候语
  const getStageGreeting = (stage: TaskStage) => {
    switch (stage) {
      case TaskStage.POETRY_RIDDLE:
        return yinFeng.greetings[0]
      case TaskStage.POET_EXPLORATION:
        return '西湖的美，被多少诗人写入诗行。请在风中找到他们的名字。'
      case TaskStage.POETRY_CREATION:
        return '让我们以你的心境，共谱一首西湖之诗。'
      default:
        return ''
    }
  }

  // 诗句接龙阶段
  const renderPoetryRiddleStage = () => {
    const stage = task.stages[TaskStage.POETRY_RIDDLE]
    const currentRiddle = stage.riddles[stage.currentRiddleIndex]

    const handleAnswerSubmit = () => {
      if (!userAnswer.trim()) {
        toast.error('请输入答案')
        return
      }

      const isCorrect = userAnswer.trim() === currentRiddle.correctAnswer
      
      if (isCorrect) {
        const updatedTask = { ...task }
        updatedTask.stages[TaskStage.POETRY_RIDDLE].correctAnswers++
        updatedTask.stages[TaskStage.POETRY_RIDDLE].progress++
        
        if (updatedTask.stages[TaskStage.POETRY_RIDDLE].progress >= updatedTask.stages[TaskStage.POETRY_RIDDLE].maxProgress) {
          // 完成第一阶段
          updatedTask.stages[TaskStage.POETRY_RIDDLE].status = TaskStatus.COMPLETED
          updatedTask.stages[TaskStage.POET_EXPLORATION].status = TaskStatus.NOT_STARTED
          updatedTask.stages[TaskStage.POET_EXPLORATION].unlockedAt = new Date()
          updatedTask.currentStage = TaskStage.POET_EXPLORATION
          updatedTask.rewards.poetryDoor = true
          updatedTask.rewards.poetryValue += 20
          
          setCurrentStage(TaskStage.POET_EXPLORATION)
          toast.success('🎉 诗意之门已开启！')
        } else {
          // 进入下一题
          updatedTask.stages[TaskStage.POETRY_RIDDLE].currentRiddleIndex++
        }
        
        setAiResponse(yinFeng.responses.correct[Math.floor(Math.random() * yinFeng.responses.correct.length)])
        onTaskUpdate(updatedTask)
      } else {
        setAiResponse(yinFeng.responses.incorrect[Math.floor(Math.random() * yinFeng.responses.incorrect.length)])
        toast.error('答案不正确，请再想想')
      }
      
      setUserAnswer('')
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-blue-800 mb-4"
          >
            {currentRiddle.question}
          </motion.div>
          <div className="text-sm text-gray-600 mb-4">
            提示：{currentRiddle.hint}
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="请输入答案..."
            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
          />
          <button
            onClick={handleAnswerSubmit}
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            提交答案
          </button>
        </div>

        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
          >
            <div className="text-lg mb-2">🌸 {yinFeng.name}</div>
            <div className="text-gray-700">{aiResponse}</div>
          </motion.div>
        )}

        <div className="text-center text-sm text-gray-500">
          进度：{stage.progress}/{stage.maxProgress}
        </div>
      </div>
    )
  }

  // 诗人探索阶段
  const renderPoetExplorationStage = () => {
    const stage = task.stages[TaskStage.POET_EXPLORATION]
    const [selectedPoet, setSelectedPoet] = useState<Poet | null>(null)
    const [conversation, setConversation] = useState<Array<{speaker: string, message: string}>>([])
    const [userMessage, setUserMessage] = useState('')

    const handlePoetSelect = (poet: Poet) => {
      setSelectedPoet(poet)
      setConversation([
        {
          speaker: poet.name,
          message: `我是${poet.name}，${poet.dynasty}诗人。${poet.description}`
        }
      ])
    }

    const handleMessageSend = () => {
      if (!userMessage.trim() || !selectedPoet) return

      const newConversation = [...conversation, { speaker: '你', message: userMessage }]
      
      // 简单的关键词匹配
      const foundClue = selectedPoet.keyClues.find(clue => 
        userMessage.includes(clue)
      )

      if (foundClue) {
        newConversation.push({
          speaker: selectedPoet.name,
          message: `是的！${foundClue}正是我的作品。你找到了关键线索！`
        })

        // 完成任务
        const updatedTask = { ...task }
        updatedTask.stages[TaskStage.POET_EXPLORATION].status = TaskStatus.COMPLETED
        updatedTask.stages[TaskStage.POETRY_CREATION].status = TaskStatus.NOT_STARTED
        updatedTask.stages[TaskStage.POETRY_CREATION].unlockedAt = new Date()
        updatedTask.currentStage = TaskStage.POETRY_CREATION
        updatedTask.rewards.poetCard = true
        updatedTask.rewards.poetryValue += 30
        
        setCurrentStage(TaskStage.POETRY_CREATION)
        onTaskUpdate(updatedTask)
        toast.success('🎉 诗人探索完成！')
      } else {
        newConversation.push({
          speaker: selectedPoet.name,
          message: `关于西湖，我有很多感悟。你可以问我关于我的作品或者生活。`
        })
      }

      setConversation(newConversation)
      setUserMessage('')
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-green-800 mb-4">
            选择一位诗人开始对话
          </div>
        </div>

        {!selectedPoet ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stage.poets.map((poet) => (
              <motion.div
                key={poet.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePoetSelect(poet)}
                className="bg-white border border-green-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="text-lg font-bold text-green-800">{poet.name}</div>
                <div className="text-sm text-gray-600">{poet.dynasty}</div>
                <div className="text-xs text-gray-500 mt-2">{poet.description}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-bold text-green-800 mb-2">与 {selectedPoet.name} 的对话</div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {conversation.map((msg, index) => (
                  <div key={index} className={`text-sm ${msg.speaker === '你' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block px-3 py-2 rounded-lg ${
                      msg.speaker === '你' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      <div className="font-medium">{msg.speaker}</div>
                      <div>{msg.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="输入你的问题..."
                className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleMessageSend()}
              />
              <button
                onClick={handleMessageSend}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 诗词创作阶段
  const renderPoetryCreationStage = () => {
    const stage = task.stages[TaskStage.POETRY_CREATION]
    const [selectedTheme, setSelectedTheme] = useState<PoetryTheme | null>(null)
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
    const [userPoetry, setUserPoetry] = useState('')
    const [aiGeneratedPoetry, setAiGeneratedPoetry] = useState('')

    const handleThemeSelect = (theme: PoetryTheme) => {
      setSelectedTheme(theme)
      setSelectedKeywords([])
      setSelectedEmotions([])
    }

    const handleKeywordToggle = (keyword: string) => {
      setSelectedKeywords(prev => 
        prev.includes(keyword) 
          ? prev.filter(k => k !== keyword)
          : [...prev, keyword]
      )
    }

    const handleEmotionToggle = (emotion: string) => {
      setSelectedEmotions(prev => 
        prev.includes(emotion) 
          ? prev.filter(e => e !== emotion)
          : [...prev, emotion]
      )
    }

    const generatePoetry = () => {
      if (!selectedTheme || selectedKeywords.length === 0 || selectedEmotions.length === 0) {
        toast.error('请选择主题、关键词和情感')
        return
      }

      // 简单的AI生成（实际项目中会调用真实的AI API）
      const poetry = `荷影摇风意未休，\n烟波深处梦悠悠。\n${selectedKeywords[0]}映${selectedEmotions[0]}，\n诗意西湖共此游。`
      
      setAiGeneratedPoetry(poetry)
      setUserPoetry(poetry)
    }

    const submitPoetry = () => {
      if (!userPoetry.trim()) {
        toast.error('请输入你的诗词')
        return
      }

      // 简单的评分逻辑（实际项目中会使用AI评分）
      const score = Math.floor(Math.random() * 20) + 80 // 80-100分
      
      const newPoetry: UserPoetry = {
        id: `poetry_${Date.now()}`,
        title: `${selectedTheme?.name}有感`,
        content: userPoetry,
        theme: selectedTheme?.id || '',
        keywords: selectedKeywords,
        emotions: selectedEmotions,
        aiScore: score,
        createdAt: new Date()
      }

      const updatedTask = { ...task }
      updatedTask.stages[TaskStage.POETRY_CREATION].status = TaskStatus.COMPLETED
      updatedTask.stages[TaskStage.POETRY_CREATION].userPoetry = newPoetry
      updatedTask.stages[TaskStage.POETRY_CREATION].aiScore = score
      updatedTask.rewards.westLakeBadge = true
      updatedTask.rewards.poetryValue += 50
      updatedTask.rewards.culturePoints += 100
      updatedTask.completedAt = new Date()

      onTaskUpdate(updatedTask)
      toast.success(`🎉 诗词创作完成！AI评分：${score}分`)
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-purple-800 mb-4">
            选择创作主题
          </div>
        </div>

        {!selectedTheme ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stage.themes.map((theme) => (
              <motion.div
                key={theme.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThemeSelect(theme)}
                className="bg-white border border-purple-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="text-lg font-bold text-purple-800">{theme.name}</div>
                <div className="text-sm text-gray-600 mt-2">{theme.description}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="font-bold text-purple-800 mb-2">主题：{selectedTheme.name}</div>
              <div className="text-sm text-gray-600">{selectedTheme.description}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-bold text-gray-800 mb-3">选择关键词</div>
                <div className="space-y-2">
                  {selectedTheme.keywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordToggle(keyword)}
                      className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedKeywords.includes(keyword)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-800 mb-3">选择情感</div>
                <div className="space-y-2">
                  {selectedTheme.emotions.map((emotion) => (
                    <button
                      key={emotion}
                      onClick={() => handleEmotionToggle(emotion)}
                      className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedEmotions.includes(emotion)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={generatePoetry}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                AI生成初稿
              </button>

              {aiGeneratedPoetry && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="font-bold text-gray-800 mb-2">AI生成的诗：</div>
                  <div className="text-gray-700 whitespace-pre-line">{aiGeneratedPoetry}</div>
                </div>
              )}

              <div>
                <div className="font-bold text-gray-800 mb-2">你的诗词：</div>
                <textarea
                  value={userPoetry}
                  onChange={(e) => setUserPoetry(e.target.value)}
                  placeholder="在这里创作你的诗词..."
                  className="w-full h-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={submitPoetry}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                提交诗词
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 渲染当前阶段
  const renderCurrentStage = () => {
    switch (currentStage) {
      case TaskStage.POETRY_RIDDLE:
        return renderPoetryRiddleStage()
      case TaskStage.POET_EXPLORATION:
        return renderPoetExplorationStage()
      case TaskStage.POETRY_CREATION:
        return renderPoetryCreationStage()
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {/* 阶段进度 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {Object.values(TaskStage).map((stage, index) => {
                const stageData = task.stages[stage]
                const isActive = currentStage === stage
                const isCompleted = stageData.status === TaskStatus.COMPLETED
                const isLocked = stageData.status === TaskStatus.LOCKED

                return (
                  <div key={stage} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-500 text-white' :
                      isLocked ? 'bg-gray-300 text-gray-500' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                       isLocked ? <Lock className="w-5 h-5" /> :
                       index === 0 ? <BookOpen className="w-5 h-5" /> :
                       index === 1 ? <Users className="w-5 h-5" /> :
                       <PenTool className="w-5 h-5" />}
                    </div>
                    {index < Object.values(TaskStage).length - 1 && (
                      <div className={`w-8 h-1 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI角色介绍 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{yinFeng.avatar}</div>
              <div>
                <div className="font-bold text-blue-800">{yinFeng.name}</div>
                <div className="text-sm text-blue-600">{yinFeng.title}</div>
              </div>
            </div>
            <div className="mt-2 text-gray-700">{getStageGreeting(currentStage)}</div>
          </div>

          {/* 当前阶段内容 */}
          {renderCurrentStage()}

          {/* 奖励显示 */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="font-bold text-yellow-800 mb-2">当前奖励</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>诗心值：{task.rewards.poetryValue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>文化积分：{task.rewards.culturePoints}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default WestLakePoetryTaskComponent
