
import { create } from 'zustand'

interface Location {
  id: string
  name: string
  type: 'temple' | 'palace' | 'garden' | 'mountain' | 'river' | 'village' | 'city'
  unlocked: boolean
  x: number
  y: number
  description: string
  tasks: string[]
  events: string[]
  parentCity?: string // 所属城市
  isCity?: boolean // 是否为城市
  subLocations?: string[] // 子地点ID列表
  guideInfo?: {
    introduction: string
    explorationTips: string[]
    highlights: string[]
    bestTime: string
    duration: string
  }
}

interface Task {
  id: string
  title: string
  description: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  maxProgress: number
  reward: string
  timeLimit?: number
  locationId: string
  type: 'exploration' | 'knowledge' | 'social' | 'collection'
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  completed: boolean
  progress: number
  maxProgress: number
  reward: string
  type: 'exploration' | 'tasks' | 'social' | 'time'
}

interface DynamicEvent {
  id: string
  title: string
  description: string
  timeRemaining: number
  reward: string
  participants: number
  maxParticipants: number
  type: 'festival' | 'discovery' | 'challenge'
}

interface Friend {
  id: string
  userName: string
  avatar: string
  level: number
  lastActive: string
  achievements: number
  tasksCompleted: number
}

interface GameState {
  locations: Location[]
  tasks: Task[]
  achievements: Achievement[]
  events: DynamicEvent[]
  friends: Friend[]
  userLevel: number
  userExperience: number
  currentTime: Date
  settings: {
    soundEnabled: boolean
    musicEnabled: boolean
    theme: 'light' | 'dark'
    showLocation: boolean
  }
}

interface GameActions {
  unlockLocation: (locationId: string) => void
  updateTaskProgress: (taskId: string, progress: number) => void
  completeTask: (taskId: string) => void
  completeAchievement: (achievementId: string) => void
  joinEvent: (eventId: string) => void
  addFriend: (friend: Friend) => void
  updateSettings: (settings: Partial<GameState['settings']>) => void
  updateTime: () => void
}

export const useGameStore = create<GameState & GameActions>((set) => ({
  // 初始状态
  locations: [
    // 城市
    {
      id: 'beijing',
      name: '北京',
      type: 'city',
      unlocked: true,
      x: 50,
      y: 30,
      description: '千年古都，明清两朝的政治中心',
      tasks: ['explore_beijing_culture'],
      events: ['beijing_festival'],
      isCity: true,
      subLocations: ['forbidden_city', 'temple_heaven', 'summer_palace', 'great_wall']
    },
    {
      id: 'hangzhou',
      name: '杭州',
      type: 'city',
      unlocked: false,
      x: 20,
      y: 70,
      description: '人间天堂，诗人墨客的灵感源泉',
      tasks: ['explore_hangzhou_culture'],
      events: ['west_lake_festival'],
      isCity: true,
      subLocations: ['west_lake', 'lingyin_temple', 'leifeng_pagoda']
    },
    {
      id: 'shanghai',
      name: '上海',
      type: 'city',
      unlocked: false,
      x: 80,
      y: 60,
      description: '东方明珠，现代与传统的完美融合',
      tasks: ['explore_shanghai_culture'],
      events: ['shanghai_festival'],
      isCity: true,
      subLocations: ['yuyuan_garden', 'bund_area', 'zhujiajiao']
    },
    {
      id: 'nanjing',
      name: '南京',
      type: 'city',
      unlocked: false,
      x: 60,
      y: 50,
      description: '六朝古都，历史文化名城',
      tasks: ['explore_nanjing_culture'],
      events: ['nanjing_festival'],
      isCity: true,
      subLocations: ['ming_xiaoling', 'confucius_temple', 'qinhuai_river']
    },
    
    // 北京的子地点
    {
      id: 'forbidden_city',
      name: '紫禁城',
      type: 'palace',
      unlocked: true,
      x: 50,
      y: 30,
      description: '明清两朝的皇家宫殿，承载着五百年的历史沧桑',
      tasks: ['explore_throne_room', 'learn_palace_history'],
      events: ['imperial_ceremony'],
      parentCity: 'beijing',
      guideInfo: {
        introduction: '紫禁城，又称故宫，是明清两朝的皇家宫殿，位于北京中轴线的中心。这座宏伟的建筑群占地72万平方米，拥有9999间房屋，是世界上现存规模最大、保存最为完整的木质结构古建筑群。',
        explorationTips: [
          '建议从午门进入，这是皇帝专用的入口',
          '太和殿是必看景点，这里是皇帝举行大典的地方',
          '可以租借语音导览器，了解每个宫殿的历史故事',
          '建议穿舒适的鞋子，因为需要走很多路',
          '避开节假日，人流量会很大'
        ],
        highlights: [
          '太和殿：皇帝登基和举行大典的地方',
          '乾清宫：皇帝的寝宫',
          '御花园：皇家园林，四季景色各异',
          '珍宝馆：收藏着历代皇家珍宝'
        ],
        bestTime: '春秋两季，天气宜人',
        duration: '建议游览时间：4-6小时'
      }
    },
    {
      id: 'temple_heaven',
      name: '天坛',
      type: 'temple',
      unlocked: false,
      x: 70,
      y: 60,
      description: '皇帝祭天的神圣之地，体现了古代天人合一的思想',
      tasks: ['prayer_ritual', 'understand_cosmology'],
      events: ['spring_prayer'],
      parentCity: 'beijing'
    },
    {
      id: 'summer_palace',
      name: '颐和园',
      type: 'garden',
      unlocked: false,
      x: 30,
      y: 20,
      description: '清朝皇家园林，山水相依的人间仙境',
      tasks: ['boat_tour', 'garden_poetry'],
      events: ['lotus_festival'],
      parentCity: 'beijing'
    },
    {
      id: 'great_wall',
      name: '万里长城',
      type: 'mountain',
      unlocked: false,
      x: 80,
      y: 10,
      description: '中华民族的象征，见证了千年的风雨沧桑',
      tasks: ['wall_exploration', 'defense_strategy'],
      events: ['beacon_lighting'],
      parentCity: 'beijing'
    },
    
    // 杭州的子地点
    {
      id: 'west_lake',
      name: '西湖',
      type: 'river',
      unlocked: false,
      x: 20,
      y: 70,
      description: '人间天堂，诗人墨客的灵感源泉',
      tasks: ['lake_cruise', 'poetry_composition'],
      events: ['moon_viewing'],
      parentCity: 'hangzhou'
    },
    {
      id: 'lingyin_temple',
      name: '灵隐寺',
      type: 'temple',
      unlocked: false,
      x: 15,
      y: 75,
      description: '千年古刹，佛教文化的重要圣地',
      tasks: ['temple_meditation', 'buddhist_study'],
      events: ['buddha_birthday'],
      parentCity: 'hangzhou'
    },
    {
      id: 'leifeng_pagoda',
      name: '雷峰塔',
      type: 'temple',
      unlocked: false,
      x: 25,
      y: 65,
      description: '白蛇传说的发源地，西湖十景之一',
      tasks: ['pagoda_climb', 'legend_study'],
      events: ['legend_festival'],
      parentCity: 'hangzhou'
    },
    
    // 上海的子地点
    {
      id: 'yuyuan_garden',
      name: '豫园',
      type: 'garden',
      unlocked: false,
      x: 80,
      y: 60,
      description: '明代古典园林，江南园林的代表作',
      tasks: ['garden_walk', 'architecture_study'],
      events: ['lantern_festival'],
      parentCity: 'shanghai'
    },
    {
      id: 'bund_area',
      name: '外滩',
      type: 'palace',
      unlocked: false,
      x: 85,
      y: 55,
      description: '万国建筑博览群，上海的历史见证',
      tasks: ['architecture_tour', 'history_study'],
      events: ['night_view'],
      parentCity: 'shanghai'
    },
    {
      id: 'zhujiajiao',
      name: '朱家角',
      type: 'village',
      unlocked: false,
      x: 75,
      y: 65,
      description: '江南水乡古镇，小桥流水人家',
      tasks: ['water_town_tour', 'local_culture'],
      events: ['water_festival'],
      parentCity: 'shanghai'
    },
    
    // 南京的子地点
    {
      id: 'ming_xiaoling',
      name: '明孝陵',
      type: 'palace',
      unlocked: false,
      x: 60,
      y: 50,
      description: '明朝开国皇帝朱元璋的陵墓',
      tasks: ['tomb_exploration', 'history_study'],
      events: ['memorial_ceremony'],
      parentCity: 'nanjing'
    },
    {
      id: 'confucius_temple',
      name: '夫子庙',
      type: 'temple',
      unlocked: false,
      x: 65,
      y: 45,
      description: '儒家文化圣地，科举考试的重要场所',
      tasks: ['confucian_study', 'exam_history'],
      events: ['confucius_birthday'],
      parentCity: 'nanjing'
    },
    {
      id: 'qinhuai_river',
      name: '秦淮河',
      type: 'river',
      unlocked: false,
      x: 55,
      y: 55,
      description: '六朝金粉地，十里秦淮河',
      tasks: ['river_cruise', 'poetry_study'],
      events: ['lantern_festival'],
      parentCity: 'nanjing'
    }
  ],

  tasks: [
    // 北京任务
    {
      id: 'explore_throne_room',
      title: '探索太和殿',
      description: '深入了解紫禁城的心脏——太和殿的历史和建筑特色',
      status: 'not_started',
      progress: 0,
      maxProgress: 100,
      reward: '获得"宫廷探索者"徽章',
      locationId: 'forbidden_city',
      type: 'exploration'
    },
    {
      id: 'learn_palace_history',
      title: '宫廷历史学习',
      description: '学习明清两朝在紫禁城发生的重要历史事件',
      status: 'not_started',
      progress: 0,
      maxProgress: 50,
      reward: '历史知识点数 +100',
      locationId: 'forbidden_city',
      type: 'knowledge'
    },
    {
      id: 'prayer_ritual',
      title: '祭天仪式',
      description: '参与古代皇帝的祭天仪式，了解传统文化',
      status: 'not_started',
      progress: 0,
      maxProgress: 1,
      reward: '获得"天子之礼"成就',
      timeLimit: 3600000, // 1小时
      locationId: 'temple_heaven',
      type: 'exploration'
    },
    {
      id: 'explore_beijing_culture',
      title: '北京文化探索',
      description: '深入了解北京的历史文化和传统习俗',
      status: 'not_started',
      progress: 0,
      maxProgress: 80,
      reward: '获得"北京通"称号',
      locationId: 'beijing',
      type: 'knowledge'
    },
    
    // 杭州任务
    {
      id: 'lake_cruise',
      title: '西湖游船',
      description: '乘坐游船欣赏西湖美景，体验江南水乡风情',
      status: 'not_started',
      progress: 0,
      maxProgress: 60,
      reward: '获得"西湖诗人"徽章',
      locationId: 'west_lake',
      type: 'exploration'
    },
    {
      id: 'poetry_composition',
      title: '诗词创作',
      description: '在西湖美景的启发下创作古诗词',
      status: 'not_started',
      progress: 0,
      maxProgress: 40,
      reward: '文学点数 +80',
      locationId: 'west_lake',
      type: 'knowledge'
    },
    {
      id: 'explore_hangzhou_culture',
      title: '杭州文化探索',
      description: '了解杭州的历史文化和人文风情',
      status: 'not_started',
      progress: 0,
      maxProgress: 70,
      reward: '获得"杭州通"称号',
      locationId: 'hangzhou',
      type: 'knowledge'
    },
    
    // 上海任务
    {
      id: 'garden_walk',
      title: '豫园漫步',
      description: '在豫园中漫步，欣赏江南园林的精美设计',
      status: 'not_started',
      progress: 0,
      maxProgress: 50,
      reward: '获得"园林鉴赏家"徽章',
      locationId: 'yuyuan_garden',
      type: 'exploration'
    },
    {
      id: 'architecture_tour',
      title: '外滩建筑之旅',
      description: '参观外滩的万国建筑群，了解上海的历史变迁',
      status: 'not_started',
      progress: 0,
      maxProgress: 60,
      reward: '建筑知识 +90',
      locationId: 'bund_area',
      type: 'knowledge'
    },
    {
      id: 'explore_shanghai_culture',
      title: '上海文化探索',
      description: '了解上海的海派文化和现代都市风情',
      status: 'not_started',
      progress: 0,
      maxProgress: 75,
      reward: '获得"上海通"称号',
      locationId: 'shanghai',
      type: 'knowledge'
    },
    
    // 南京任务
    {
      id: 'tomb_exploration',
      title: '明孝陵探秘',
      description: '探索明孝陵，了解明朝皇陵的建筑特色',
      status: 'not_started',
      progress: 0,
      maxProgress: 70,
      reward: '获得"陵墓探索者"徽章',
      locationId: 'ming_xiaoling',
      type: 'exploration'
    },
    {
      id: 'confucian_study',
      title: '儒家文化学习',
      description: '在夫子庙学习儒家文化和科举制度',
      status: 'not_started',
      progress: 0,
      maxProgress: 55,
      reward: '儒家知识 +85',
      locationId: 'confucius_temple',
      type: 'knowledge'
    },
    {
      id: 'explore_nanjing_culture',
      title: '南京文化探索',
      description: '了解南京的六朝古都文化和历史底蕴',
      status: 'not_started',
      progress: 0,
      maxProgress: 65,
      reward: '获得"南京通"称号',
      locationId: 'nanjing',
      type: 'knowledge'
    },
    
    // 限时任务（天气/节日相关）
    {
      id: 'spring_festival_task',
      title: '春节文化体验',
      description: '体验传统春节文化，学习年俗知识',
      status: 'not_started',
      progress: 0,
      maxProgress: 1,
      reward: '获得"春节使者"称号',
      timeLimit: 86400000, // 24小时
      locationId: 'beijing',
      type: 'social'
    },
    {
      id: 'mid_autumn_festival',
      title: '中秋赏月',
      description: '在西湖边赏月，体验中秋传统文化',
      status: 'not_started',
      progress: 0,
      maxProgress: 1,
      reward: '获得"月下诗人"徽章',
      timeLimit: 43200000, // 12小时
      locationId: 'west_lake',
      type: 'social'
    },
    {
      id: 'national_day_celebration',
      title: '国庆庆典',
      description: '参与国庆庆典活动，感受爱国情怀',
      status: 'not_started',
      progress: 0,
      maxProgress: 1,
      reward: '获得"爱国者"徽章',
      timeLimit: 172800000, // 48小时
      locationId: 'beijing',
      type: 'social'
    },
    {
      id: 'rainy_day_exploration',
      title: '雨中探索',
      description: '在雨天探索古建筑，体验不同的文化氛围',
      status: 'not_started',
      progress: 0,
      maxProgress: 1,
      reward: '获得"雨行者"称号',
      timeLimit: 21600000, // 6小时
      locationId: 'yuyuan_garden',
      type: 'exploration'
    }
  ],

  achievements: [
    {
      id: 'first_exploration',
      title: '初次探索',
      description: '完成第一个探索任务',
      icon: '🗺️',
      completed: false,
      progress: 0,
      maxProgress: 1,
      reward: '探索者称号',
      type: 'exploration'
    },
    {
      id: 'knowledge_seeker',
      title: '求知者',
      description: '完成10个知识类任务',
      icon: '📚',
      completed: false,
      progress: 0,
      maxProgress: 10,
      reward: '智慧光环',
      type: 'tasks'
    },
    {
      id: 'social_butterfly',
      title: '社交达人',
      description: '添加5个好友',
      icon: '👥',
      completed: false,
      progress: 0,
      maxProgress: 5,
      reward: '人气徽章',
      type: 'social'
    },
    {
      id: 'time_traveler',
      title: '时空旅者',
      description: '连续7天登录',
      icon: '⏰',
      completed: false,
      progress: 0,
      maxProgress: 7,
      reward: '时间宝石',
      type: 'time'
    }
  ],

  events: [
    {
      id: 'imperial_ceremony',
      title: '皇家典礼',
      description: '参与盛大的皇家典礼，体验古代宫廷文化',
      timeRemaining: 7200000, // 2小时
      reward: '皇家荣誉勋章',
      participants: 23,
      maxParticipants: 100,
      type: 'festival'
    },
    {
      id: 'ancient_discovery',
      title: '古物发现',
      description: '考古学家在古村落发现了神秘文物',
      timeRemaining: 3600000, // 1小时
      reward: '考古学家称号',
      participants: 8,
      maxParticipants: 20,
      type: 'discovery'
    }
  ],

  friends: [
    {
      id: 'friend1',
      userName: '古韵诗人',
      avatar: '👨‍🎓',
      level: 12,
      lastActive: '2小时前',
      achievements: 15,
      tasksCompleted: 23
    },
    {
      id: 'friend2',
      userName: '墨香才女',
      avatar: '👩‍🎨',
      level: 8,
      lastActive: '1天前',
      achievements: 8,
      tasksCompleted: 12
    }
  ],

  userLevel: 5,
  userExperience: 1250,
  currentTime: new Date(),

  settings: {
    soundEnabled: true,
    musicEnabled: true,
    theme: 'light',
    showLocation: true
  },

  // Actions
  unlockLocation: (locationId: string) => {
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId ? { ...location, unlocked: true } : location
      )
    }))
  },

  updateTaskProgress: (taskId: string, progress: number) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              progress: Math.min(progress, task.maxProgress),
              status: progress >= task.maxProgress ? 'completed' : 'in_progress'
            }
          : task
      )
    }))
  },

  completeTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'completed', progress: task.maxProgress }
          : task
      )
    }))
  },

  completeAchievement: (achievementId: string) => {
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === achievementId
          ? { ...achievement, completed: true, progress: achievement.maxProgress }
          : achievement
      )
    }))
  },

  joinEvent: (eventId: string) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? { ...event, participants: event.participants + 1 }
          : event
      )
    }))
  },

  addFriend: (friend: Friend) => {
    set((state) => ({
      friends: [...state.friends, friend]
    }))
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
  },

  updateTime: () => {
    set({ currentTime: new Date() })
  }
}))
