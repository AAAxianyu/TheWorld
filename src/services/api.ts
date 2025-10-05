// API服务模块 - 集成高德地图API和DeepSeek API

// 高德地图API配置
const AMAP_API_KEY = import.meta.env.VITE_AMAP_API_KEY || 'your_amap_api_key'
const AMAP_BASE_URL = 'https://restapi.amap.com/v3'

// DeepSeek API配置
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'your_deepseek_api_key'
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

// 类型定义
export interface LocationInfo {
  province: string
  city: string
  adcode: string
}

export interface WeatherInfo {
  province: string
  city: string
  weather: string
  temperature: string
  winddirection: string
  windpower: string
  humidity: string
  reporttime: string
}

export interface WeatherForecast {
  date: string
  week: string
  dayweather: string
  nightweather: string
  daytemp: string
  nighttemp: string
  daywind: string
  nightwind: string
  daypower: string
  nightpower: string
}

export interface WeatherResponse {
  status: string
  info: string
  infocode: string
  lives: WeatherInfo[]
  forecasts: Array<{
    city: string
    adcode: string
    province: string
    forecast: WeatherForecast[]
  }>
}

export interface GeneratedTask {
  title: string
  description: string
  type: 'weather' | 'festival' | 'seasonal'
  duration: number // 任务持续时间（小时）
  reward: string
  weatherCondition?: string
  festivalType?: string
}

// 高德地图API服务
export class AmapService {
  // 通过IP获取位置信息
  static async getLocationByIP(): Promise<LocationInfo> {
    try {
      const response = await fetch(`${AMAP_BASE_URL}/ip?key=${AMAP_API_KEY}`)
      const data = await response.json()
      
      if (data.status === '1') {
        return {
          province: data.province,
          city: data.city,
          adcode: data.adcode
        }
      } else {
        throw new Error(`API错误: ${data.info}`)
      }
    } catch (error) {
      console.error('获取位置信息失败:', error)
      // 返回默认位置（北京）
      return {
        province: '北京市',
        city: '北京市',
        adcode: '110000'
      }
    }
  }

  // 获取天气信息
  static async getWeatherInfo(adcode: string): Promise<WeatherResponse> {
    try {
      const response = await fetch(
        `${AMAP_BASE_URL}/weather/weatherInfo?city=${adcode}&key=${AMAP_API_KEY}&extensions=all`
      )
      const data = await response.json()
      
      if (data.status === '1') {
        return data
      } else {
        throw new Error(`天气API错误: ${data.info}`)
      }
    } catch (error) {
      console.error('获取天气信息失败:', error)
      throw error
    }
  }
}

// DeepSeek API服务
export class DeepSeekService {
  // 生成基于天气和节日的任务
  static async generateTask(
    weatherInfo: WeatherInfo,
    festivalInfo?: string
  ): Promise<GeneratedTask> {
    try {
      const prompt = this.buildPrompt(weatherInfo, festivalInfo)
      
      const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个古风游戏的任务设计师，专门为古风探索游戏生成有趣的限时任务。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: false
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0]) {
        const content = data.choices[0].message.content
        return this.parseTaskFromResponse(content, weatherInfo, festivalInfo)
      } else {
        throw new Error('生成任务失败')
      }
    } catch (error) {
      console.error('生成任务失败:', error)
      // 返回默认任务
      return this.getDefaultTask(weatherInfo, festivalInfo)
    }
  }

  // 构建提示词
  private static buildPrompt(weatherInfo: WeatherInfo, festivalInfo?: string): string {
    const weatherDesc = `${weatherInfo.city}：${weatherInfo.weather} ${weatherInfo.temperature}°C`
    const festivalDesc = festivalInfo ? `，今天是${festivalInfo}` : ''
    
    return `根据今天的天气（${weatherDesc}）${festivalDesc}，为古风探索游戏生成一个限时任务。

要求：
1. 任务名称要有古风韵味
2. 任务描述要结合天气和节日特色
3. 任务类型：weather（天气相关）、festival（节日相关）、seasonal（季节相关）
4. 任务持续时间：1-24小时
5. 奖励要有古风特色
6. 返回JSON格式：{"title": "任务名称", "description": "任务描述", "type": "任务类型", "duration": 持续时间, "reward": "奖励", "weatherCondition": "天气条件", "festivalType": "节日类型"}`
  }

  // 解析AI响应为任务对象
  private static parseTaskFromResponse(
    content: string,
    weatherInfo: WeatherInfo,
    festivalInfo?: string
  ): GeneratedTask {
    try {
      // 尝试提取JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const taskData = JSON.parse(jsonMatch[0])
        return {
          title: taskData.title || '古风探索任务',
          description: taskData.description || '体验古风文化',
          type: taskData.type || 'weather',
          duration: taskData.duration || 6,
          reward: taskData.reward || '古风徽章',
          weatherCondition: weatherInfo.weather,
          festivalType: festivalInfo
        }
      }
    } catch (error) {
      console.error('解析任务响应失败:', error)
    }

    // 如果解析失败，返回默认任务
    return this.getDefaultTask(weatherInfo, festivalInfo)
  }

  // 获取默认任务
  private static getDefaultTask(weatherInfo: WeatherInfo, festivalInfo?: string): GeneratedTask {
    const weather = weatherInfo.weather
    const city = weatherInfo.city
    
    if (festivalInfo) {
      return {
        title: `${festivalInfo}庆典`,
        description: `在${city}参与${festivalInfo}庆典活动，体验传统节日文化`,
        type: 'festival',
        duration: 12,
        reward: '节日徽章',
        weatherCondition: weather,
        festivalType: festivalInfo
      }
    }

    if (weather.includes('雨') || weather.includes('雪')) {
      return {
        title: '雨中漫步',
        description: `在${city}的${weather}中漫步，体验别样的古风韵味`,
        type: 'weather',
        duration: 6,
        reward: '雨行者徽章',
        weatherCondition: weather
      }
    }

    if (weather.includes('晴') || weather.includes('多云')) {
      return {
        title: '晴日探访',
        description: `趁着${weather}的好天气，在${city}探索古建筑和文化景点`,
        type: 'weather',
        duration: 8,
        reward: '探索者徽章',
        weatherCondition: weather
      }
    }

    return {
      title: '古风探索',
      description: `在${city}体验古风文化，感受历史韵味`,
      type: 'weather',
      duration: 6,
      reward: '古风徽章',
      weatherCondition: weather
    }
  }
}

// 节日检测服务
export class FestivalService {
  // 检测当前是否为节日
  static getCurrentFestival(): string | null {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    
    // 主要节日映射
    const festivals: { [key: string]: string } = {
      '1-1': '元旦',
      '2-14': '情人节',
      '3-8': '妇女节',
      '4-1': '愚人节',
      '5-1': '劳动节',
      '5-4': '青年节',
      '6-1': '儿童节',
      '7-1': '建党节',
      '8-1': '建军节',
      '9-10': '教师节',
      '10-1': '国庆节',
      '12-25': '圣诞节'
    }

    // 农历节日（简化处理，实际应该使用农历库）
    const lunarFestivals: { [key: string]: string } = {
      '1-1': '春节',
      '1-15': '元宵节',
      '5-5': '端午节',
      '7-7': '七夕节',
      '8-15': '中秋节',
      '9-9': '重阳节'
    }

    const key = `${month}-${day}`
    return festivals[key] || lunarFestivals[key] || null
  }

  // 获取季节信息
  static getCurrentSeason(): string {
    const month = new Date().getMonth() + 1
    
    if (month >= 3 && month <= 5) return '春季'
    if (month >= 6 && month <= 8) return '夏季'
    if (month >= 9 && month <= 11) return '秋季'
    return '冬季'
  }
}

// 综合服务 - 主要的API调用入口
export class VirtualLifeService {
  // 获取完整的环境信息（位置+天气+节日）
  static async getEnvironmentInfo(): Promise<{
    location: LocationInfo
    weather: WeatherInfo
    festival: string | null
    season: string
  }> {
    try {
      const location = await AmapService.getLocationByIP()
      const weatherData = await AmapService.getWeatherInfo(location.adcode)
      const weather = weatherData.lives[0]
      const festival = FestivalService.getCurrentFestival()
      const season = FestivalService.getCurrentSeason()

      return {
        location,
        weather,
        festival,
        season
      }
    } catch (error) {
      console.error('获取环境信息失败:', error)
      throw error
    }
  }

  // 生成动态任务
  static async generateDynamicTask(): Promise<GeneratedTask> {
    try {
      const envInfo = await this.getEnvironmentInfo()
      return await DeepSeekService.generateTask(envInfo.weather, envInfo.festival || undefined)
    } catch (error) {
      console.error('生成动态任务失败:', error)
      // 返回默认任务
      return {
        title: '古风探索',
        description: '体验古风文化，感受历史韵味',
        type: 'weather',
        duration: 6,
        reward: '古风徽章'
      }
    }
  }
}