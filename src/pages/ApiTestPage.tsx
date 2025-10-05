import React, { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { VirtualLifeService, AmapService, DeepSeekService } from '../services/api'
import toast from 'react-hot-toast'

const ApiTestPage: React.FC = () => {
  const { environmentInfo, updateEnvironmentInfo, generateDynamicTask } = useGameStore()
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>({})

  // 测试IP定位
  const testIpLocation = async () => {
    setLoading(true)
    try {
      const result = await AmapService.getLocationByIP()
      setTestResults(prev => ({ ...prev, ipLocation: result }))
      toast.success('IP定位测试成功')
    } catch (error) {
      console.error('IP定位测试失败:', error)
      toast.error('IP定位测试失败')
    } finally {
      setLoading(false)
    }
  }

  // 测试天气查询
  const testWeather = async () => {
    setLoading(true)
    try {
      const location = await AmapService.getLocationByIP()
      const weatherData = await AmapService.getWeatherInfo(location.adcode)
      setTestResults(prev => ({ ...prev, weather: weatherData }))
      toast.success('天气查询测试成功')
    } catch (error) {
      console.error('天气查询测试失败:', error)
      toast.error('天气查询测试失败')
    } finally {
      setLoading(false)
    }
  }

  // 测试DeepSeek AI任务生成
  const testDeepSeekTask = async () => {
    setLoading(true)
    try {
      const result = await VirtualLifeService.generateDynamicTask()
      setTestResults(prev => ({ ...prev, deepseekTask: result }))
      toast.success('DeepSeek AI任务生成测试成功')
    } catch (error) {
      console.error('DeepSeek AI任务生成测试失败:', error)
      toast.error('DeepSeek AI任务生成测试失败')
    } finally {
      setLoading(false)
    }
  }

  // 测试完整流程
  const testFullFlow = async () => {
    setLoading(true)
    try {
      await updateEnvironmentInfo()
      await generateDynamicTask()
      toast.success('完整流程测试成功')
    } catch (error) {
      console.error('完整流程测试失败:', error)
      toast.error('完整流程测试失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">API功能测试页面 (DeepSeek版)</h1>
        
        {/* 环境信息显示 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">当前环境信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">位置信息</h3>
              <p className="text-sm text-gray-600">
                {environmentInfo.location ? 
                  `${environmentInfo.location.city}, ${environmentInfo.location.province}` : 
                  '未获取'
                }
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">天气信息</h3>
              <p className="text-sm text-gray-600">
                {environmentInfo.weather ? 
                  `${environmentInfo.weather.weather} ${environmentInfo.weather.temperature}°C` : 
                  '未获取'
                }
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">节日信息</h3>
              <p className="text-sm text-gray-600">
                {environmentInfo.festival || '无'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">季节信息</h3>
              <p className="text-sm text-gray-600">
                {environmentInfo.season || '未获取'}
              </p>
            </div>
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">功能测试</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={testIpLocation}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              IP定位测试
            </button>
            <button
              onClick={testWeather}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              天气查询测试
            </button>
            <button
              onClick={testDeepSeekTask}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              DeepSeek AI测试
            </button>
            <button
              onClick={testFullFlow}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              完整流程测试
            </button>
          </div>
        </div>

        {/* 测试结果 */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* 配置说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">DeepSeek API配置说明</h2>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>1. 创建 .env.local 文件：</strong></p>
            <pre className="bg-blue-100 p-2 rounded mt-2">
{`# 高德地图API密钥
VITE_AMAP_API_KEY=你的高德地图API密钥

# DeepSeek API密钥  
VITE_DEEPSEEK_API_KEY=你的DeepSeek_API密钥`}
            </pre>
            <p><strong>2. 高德地图API申请：</strong> https://lbs.amap.com/dev/key/app</p>
            <p><strong>3. DeepSeek API申请：</strong> https://platform.deepseek.com/</p>
            <p><strong>4. API特点：</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>使用OpenAI兼容的API格式</li>
              <li>模型：deepseek-chat</li>
              <li>支持流式和非流式输出</li>
              <li>更稳定的API服务</li>
            </ul>
            <p><strong>5. 重启开发服务器：</strong> npm run dev</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTestPage
