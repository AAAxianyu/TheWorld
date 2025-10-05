import React, { useState } from 'react'
import { Settings, Key, MapPin, Sparkles, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const ApiConfigPage: React.FC = () => {
  const [amapKey, setAmapKey] = useState('')
  const [sparkKey, setSparkKey] = useState('')
  const [showKeys, setShowKeys] = useState(false)

  const handleSave = () => {
    // 在实际应用中，这里应该将密钥保存到安全的地方
    // 这里只是演示，实际应该使用环境变量或安全的配置存储
    localStorage.setItem('amap_api_key', amapKey)
    localStorage.setItem('spark_api_key', sparkKey)
    
    toast.success('API密钥已保存！', {
      icon: '🔑'
    })
  }

  const handleTest = async () => {
    if (!amapKey || !sparkKey) {
      toast.error('请先输入API密钥')
      return
    }

    try {
      // 测试高德地图API
      const amapResponse = await fetch(`https://restapi.amap.com/v3/ip?key=${amapKey}`)
      const amapData = await amapResponse.json()
      
      if (amapData.status === '1') {
        toast.success(`高德API测试成功！检测到位置：${amapData.city}`)
      } else {
        toast.error(`高德API测试失败：${amapData.info}`)
      }
    } catch (error) {
      toast.error('API测试失败，请检查网络连接')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* 标题 */}
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 text-amber-600 mr-3" />
            <h1 className="text-2xl font-bold text-amber-800 font-serif">API配置</h1>
          </div>

          {/* 说明文字 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">配置说明</h3>
            <p className="text-blue-700 text-sm mb-2">
              为了使用虚拟人生探索系统的完整功能，您需要配置以下API密钥：
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>高德地图API</strong>：用于IP定位和天气查询</li>
              <li>• <strong>星火大模型API</strong>：用于AI任务生成</li>
            </ul>
          </div>

          {/* 高德地图API配置 */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">高德地图API</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API密钥
                </label>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={amapKey}
                    onChange={(e) => setAmapKey(e.target.value)}
                    placeholder="请输入高德地图API密钥"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <p>申请地址：<a href="https://lbs.amap.com/dev/key/app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://lbs.amap.com/dev/key/app</a></p>
                <p>需要开通的服务：IP定位服务、天气查询服务</p>
              </div>
            </div>
          </div>

          {/* 星火大模型API配置 */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">星火大模型API</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API密钥
                </label>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={sparkKey}
                    onChange={(e) => setSparkKey(e.target.value)}
                    placeholder="请输入星火大模型API密钥"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(!showKeys)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <p>申请地址：<a href="https://xinghuo.xfyun.cn/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">https://xinghuo.xfyun.cn/</a></p>
                <p>需要申请API访问权限和足够的调用额度</p>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              保存配置
            </button>
            <button
              onClick={handleTest}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Key className="w-4 h-4 mr-2" />
              测试连接
            </button>
          </div>

          {/* 注意事项 */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 安全提醒</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• API密钥是敏感信息，请妥善保管</li>
              <li>• 不要将API密钥提交到公共代码仓库</li>
              <li>• 定期更换API密钥以确保安全</li>
              <li>• 在生产环境中使用环境变量存储密钥</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiConfigPage
