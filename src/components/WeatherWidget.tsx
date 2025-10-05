import React, { useEffect, useState } from 'react'
import { Cloud, Sun, CloudRain, Snow, Wind, Thermometer, MapPin, Calendar } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

interface WeatherWidgetProps {
  className?: string
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className = '' }) => {
  const { environmentInfo, updateEnvironmentInfo } = useGameStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadWeatherData = async () => {
      if (!environmentInfo.weather) {
        setLoading(true)
        try {
          await updateEnvironmentInfo()
          setError(null)
        } catch (err) {
          setError('获取天气信息失败')
        } finally {
          setLoading(false)
        }
      }
    }

    loadWeatherData()
  }, [environmentInfo.weather, updateEnvironmentInfo])

  const getWeatherIcon = (weather: string) => {
    if (weather.includes('晴')) return <Sun className="w-6 h-6 text-yellow-500" />
    if (weather.includes('云')) return <Cloud className="w-6 h-6 text-gray-500" />
    if (weather.includes('雨')) return <CloudRain className="w-6 h-6 text-blue-500" />
    if (weather.includes('雪')) return <Snow className="w-6 h-6 text-blue-200" />
    return <Cloud className="w-6 h-6 text-gray-500" />
  }

  const getWeatherColor = (weather: string) => {
    if (weather.includes('晴')) return 'from-yellow-100 to-orange-100'
    if (weather.includes('云')) return 'from-gray-100 to-blue-100'
    if (weather.includes('雨')) return 'from-blue-100 to-indigo-100'
    if (weather.includes('雪')) return 'from-blue-50 to-cyan-100'
    return 'from-gray-100 to-gray-200'
  }

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-100 to-pink-100 rounded-lg p-4 ${className}`}>
        <div className="flex items-center text-red-600">
          <Cloud className="w-6 h-6 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    )
  }

  if (!environmentInfo.weather) {
    return null
  }

  const { weather, temperature, winddirection, windpower, humidity, city } = environmentInfo.weather
  const { festival, season } = environmentInfo

  return (
    <div className={`bg-gradient-to-br ${getWeatherColor(weather)} rounded-lg p-4 shadow-lg ${className}`}>
      {/* 位置和节日信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-gray-700">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{city}</span>
        </div>
        {festival && (
          <div className="flex items-center text-red-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{festival}</span>
          </div>
        )}
      </div>

      {/* 主要天气信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {getWeatherIcon(weather)}
          <div className="ml-3">
            <div className="text-lg font-bold text-gray-800">{weather}</div>
            <div className="text-xs text-gray-600">{season}</div>
          </div>
        </div>
        <div className="flex items-center text-2xl font-bold text-gray-800">
          <Thermometer className="w-6 h-6 mr-1" />
          {temperature}°C
        </div>
      </div>

      {/* 详细信息 */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center">
          <Wind className="w-3 h-3 mr-1" />
          <span>{winddirection} {windpower}</span>
        </div>
        <div className="flex items-center">
          <Cloud className="w-3 h-3 mr-1" />
          <span>湿度 {humidity}</span>
        </div>
      </div>

      {/* 节日提示 */}
      {festival && (
        <div className="mt-3 p-2 bg-red-50 rounded-md border border-red-200">
          <div className="text-xs text-red-700 font-medium">
            🎉 {festival}特别活动进行中
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherWidget

