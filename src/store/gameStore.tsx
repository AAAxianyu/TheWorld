
import { create } from 'zustand'
import { 
  VirtualLifeService, 
  LocationInfo, 
  WeatherInfo
} from '../services/api'

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
  detailedDescription?: string // 详细任务描述
  specificTarget?: string // 具体目标（如：太和殿的龙椅）
  historicalContext?: string // 历史背景
  status: 'not_started' | 'in_progress' | 'completed' | 'expired'
  progress: number
  maxProgress: number
  reward: string
  timeLimit?: number
  locationId: string
  type: 'exploration' | 'knowledge' | 'social' | 'collection' | 'limited_time'
  startTime?: number // 任务开始时间戳
  endTime?: number // 任务结束时间戳
  isLimitedTime?: boolean // 是否为限时任务
  isDynamic?: boolean // 是否为动态生成的任务
  generatedAt?: number // 任务生成时间戳
  weatherCondition?: string // 天气条件
  festivalType?: string // 节日类型
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

interface NFT {
  id: string
  name: string
  description: string
  image: string
  locationId: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockDate: number
  metadata: {
    explorationTime: number
    weatherCondition?: string
    festivalType?: string
    specialEvent?: string
  }
}

interface DynamicAchievement {
  id: string
  title: string
  description: string
  icon: string
  completed: boolean
  progress: number
  maxProgress: number
  reward: string
  type: 'exploration' | 'tasks' | 'social' | 'time' | 'limited_time'
  unlockCondition: {
    tasksCompleted?: number
    locationsUnlocked?: number
    friendsAdded?: number
    consecutiveDays?: number
    specialEvents?: string[]
  }
  isDynamic?: boolean
  generatedAt?: number
}

interface EnvironmentInfo {
  location?: LocationInfo
  weather?: WeatherInfo
  festival?: string | null
  season?: string
}

interface GameState {
  locations: Location[]
  tasks: Task[]
  achievements: Achievement[]
  dynamicAchievements: DynamicAchievement[]
  events: DynamicEvent[]
  friends: Friend[]
  nfts: NFT[]
  userLevel: number
  userExperience: number
  currentTime: Date
  environmentInfo: EnvironmentInfo
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
  generateNFT: (locationId: string, metadata?: Record<string, unknown>) => void
  generateDynamicAchievement: (condition: Record<string, unknown>) => void
  checkLimitedTimeTasks: () => void
  startLimitedTimeTask: (taskId: string) => void
  updateEnvironmentInfo: () => Promise<void>
  generateDynamicTask: () => Promise<void>
  removeExpiredDynamicTasks: () => void
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
      parentCity: 'beijing',
      guideInfo: {
        introduction: '天坛是明清两朝皇帝祭天的地方，体现了中国古代"天人合一"的哲学思想。整个建筑群严格按照古代天文学和宇宙观设计，是中华文明的重要象征。',
        explorationTips: [
          '建议从南门进入，沿着中轴线向北游览，感受古代建筑的对称美',
          '祈年殿是必看景点，注意观察28根金丝楠木柱的天象排列',
          '回音壁是著名的声学奇迹，可以体验古代建筑的智慧',
          '建议在春秋两季游览，避开夏季高温和冬季严寒',
          '可以租借语音导览器，深入了解每个建筑的历史意义'
        ],
        highlights: [
          '祈年殿：皇帝祈谷的地方，建筑结构体现天象',
          '皇穹宇：存放神位的地方，回音壁声学效果神奇',
          '圜丘坛：祭天的核心建筑，三层圆台象征天圆地方',
          '丹陛桥：连接南北建筑群的甬道，寓意通天之路'
        ],
        bestTime: '春秋两季，特别是清明和重阳时节',
        duration: '建议游览时间：3-4小时'
      }
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
      parentCity: 'hangzhou',
      guideInfo: {
        introduction: '西湖是中国最著名的湖泊之一，以其秀美的山水风光和深厚的文化底蕴而闻名于世。这里不仅有自然美景，更承载着千年的文化传承，是文人墨客的灵感源泉。',
        explorationTips: [
          '建议从断桥残雪开始游览，这是西湖最著名的景点之一',
          '乘坐游船游览湖心岛，欣赏三潭印月的奇观',
          '苏堤春晓是最佳拍照地点，特别是春季桃花盛开时',
          '可以租借自行车环湖游览，体验不同的观赏角度',
          '建议在清晨或傍晚游览，避开中午的强烈阳光'
        ],
        highlights: [
          '断桥残雪：许仙白娘子传说的发生地',
          '三潭印月：西湖的标志性景观，月夜美景',
          '苏堤春晓：苏轼主持修建的著名堤岸',
          '雷峰塔：白蛇传说的经典场景'
        ],
        bestTime: '春季和秋季，特别是3-5月和9-11月',
        duration: '建议游览时间：半天到一天'
      }
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
      detailedDescription: '太和殿是紫禁城内最宏伟的建筑，也是中国古代建筑艺术的巅峰之作。这座大殿高35米，面积2377平方米，是皇帝举行重大典礼的地方。',
      specificTarget: '仔细观察太和殿内的龙椅（金銮宝座），这是明清两朝皇帝的御座，由紫檀木制成，镶嵌着珍贵的宝石和珍珠。龙椅上方悬挂着"建极绥猷"匾额，寓意皇帝要建立最高的准则，安抚天下。',
      historicalContext: '太和殿始建于明永乐十八年（1420年），原名奉天殿。清朝康熙年间重建，改名为太和殿。这里见证了明清两朝24位皇帝的登基大典，包括康熙、雍正、乾隆等著名皇帝的即位仪式。',
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
      detailedDescription: '紫禁城作为明清两朝的政治中心，见证了无数重要的历史时刻。从永乐大帝的迁都北京，到康熙皇帝的文治武功，再到乾隆皇帝的盛世辉煌，每一砖一瓦都承载着深厚的历史底蕴。',
      specificTarget: '重点了解乾清宫的历史，这里是皇帝的寝宫，也是处理日常政务的地方。特别关注康熙皇帝在这里批阅奏折的御案，以及雍正皇帝设立的军机处。',
      historicalContext: '乾清宫始建于明永乐十八年，是紫禁城内廷的主要建筑。明朝时，这里是皇帝的寝宫；清朝时，皇帝移居养心殿，乾清宫主要用于接见大臣和处理政务。康熙皇帝曾在这里居住61年，是历史上在位时间最长的皇帝。',
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
      detailedDescription: '天坛是明清两朝皇帝祭天的地方，体现了中国古代"天人合一"的哲学思想。这里每年都会举行盛大的祭天仪式，祈求风调雨顺、国泰民安。',
      specificTarget: '仔细观察祈年殿内的28根金丝楠木柱，这些柱子按照天象排列：内圈4根代表四季，中圈12根代表12个月，外圈12根代表12个时辰。殿顶的藻井绘有龙凤图案，象征着皇权与天命的结合。',
      historicalContext: '祈年殿始建于明永乐十八年，原名大祀殿。清朝乾隆年间重建，改名为祈年殿。这里每年正月上辛日举行祈谷大典，祈求五谷丰登。殿内供奉着昊天上帝的神位，是皇帝与天沟通的神圣场所。',
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
      detailedDescription: '西湖是中国最著名的湖泊之一，以其秀美的山水风光和深厚的文化底蕴而闻名于世。乘坐游船游览西湖，可以欣赏到"苏堤春晓"、"曲院风荷"、"平湖秋月"等著名景点。',
      specificTarget: '特别关注三潭印月，这是西湖的标志性景观。三个石塔呈三角形排列，每当月圆之夜，月光透过石塔的圆孔投射到湖面上，形成三个月亮的美景。仔细观察石塔的造型和位置，了解其设计寓意。',
      historicalContext: '三潭印月始建于北宋元祐年间，由苏轼主持修建。石塔的设计体现了中国古代园林艺术的精髓，既有实用价值（作为航标），又有观赏价值（月夜美景）。这里也是许多文人墨客吟诗作画的地方。',
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
      detailedDescription: '西湖自古以来就是文人墨客的灵感源泉，无数脍炙人口的诗词都诞生于此。从白居易的"最爱湖东行不足，绿杨阴里白沙堤"，到苏轼的"欲把西湖比西子，淡妆浓抹总相宜"，西湖的美景激发了无数诗人的创作灵感。',
      specificTarget: '在苏堤上寻找灵感，这里是最适合创作的地方。仔细观察苏堤的六座桥：映波桥、锁澜桥、望山桥、压堤桥、东浦桥和跨虹桥，每座桥都有其独特的造型和寓意。尝试为其中一座桥创作一首诗。',
      historicalContext: '苏堤是北宋文学家苏轼在杭州任职时主持修建的，全长2.8公里，横跨西湖。堤上种植着桃树和柳树，形成了"苏堤春晓"的著名景观。这里不仅是交通要道，更是文人雅士聚会吟诗的地方。',
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
    },
    
    // 限时任务示例
    {
      id: 'national_day_celebration_task',
      title: '国庆游园庆典',
      description: '国庆假期期间，市民可以参与一系列庆祝活动，包括舞龙舞狮、烟花表演和灯光秀。玩家将需要在城市中找到庆祝活动的地点，并完成一系列任务以赢得奖励。',
      status: 'not_started',
      progress: 0,
      maxProgress: 5,
      reward: '获得"国庆庆典参与者"称号 + 特殊烟花NFT',
      timeLimit: 172800000, // 48小时
      locationId: 'beijing',
      type: 'limited_time',
      isLimitedTime: true,
      startTime: Date.now(),
      endTime: Date.now() + 172800000, // 48小时后
      festivalType: 'national_day',
      weatherCondition: 'sunny'
    },
    {
      id: 'rainy_night_jiangnan_task',
      title: '雨夜江南游',
      description: '明天预计会下小雨，玩家可以在虚拟世界中体验一场雨夜江南游。任务要求玩家在江南水乡的街道上散步，解锁隐藏的故事和活动，同时避开突如其来的大雨。',
      status: 'not_started',
      progress: 0,
      maxProgress: 3,
      reward: '获得"雨夜诗人"称号 + 江南雨景NFT',
      timeLimit: 86400000, // 24小时
      locationId: 'west_lake',
      type: 'limited_time',
      isLimitedTime: true,
      startTime: Date.now(),
      endTime: Date.now() + 86400000, // 24小时后
      weatherCondition: 'rainy',
      festivalType: 'seasonal'
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

  dynamicAchievements: [],

  nfts: [],

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
  environmentInfo: {
    location: undefined,
    weather: undefined,
    festival: null,
    season: ''
  },

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
  },

  generateNFT: (locationId: string, metadata: Record<string, unknown> = {}) => {
    set((state) => {
      const location = state.locations.find(l => l.id === locationId)
      if (!location) return state

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

      const nft: NFT = {
        id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${location.name}探索纪念`,
        description: `在${location.name}的探索纪念物，记录了你的探索时光`,
        image: getLocationIcon(location.type),
        locationId: locationId,
        rarity: Math.random() > 0.8 ? 'legendary' : 
                Math.random() > 0.6 ? 'epic' : 
                Math.random() > 0.3 ? 'rare' : 'common',
        unlockDate: Date.now(),
        metadata: {
          explorationTime: Date.now(),
          ...metadata
        }
      }

      return {
        ...state,
        nfts: [...state.nfts, nft]
      }
    })
  },

  generateDynamicAchievement: (condition: Record<string, unknown>) => {
    const achievement: DynamicAchievement = {
      id: `dynamic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: '动态成就',
      description: '基于你的探索行为自动生成的成就',
      icon: '🎯',
      completed: false,
      progress: 0,
      maxProgress: 1,
      reward: '动态奖励',
      type: 'exploration',
      unlockCondition: condition,
      isDynamic: true,
      generatedAt: Date.now()
    }

    set((state) => ({
      dynamicAchievements: [...state.dynamicAchievements, achievement]
    }))
  },

  checkLimitedTimeTasks: () => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.isLimitedTime && task.endTime && Date.now() > task.endTime) {
          return { ...task, status: 'expired' }
        }
        return task
      })
    }))
  },

  startLimitedTimeTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId && task.isLimitedTime
          ? { 
              ...task, 
              status: 'in_progress',
              startTime: Date.now()
            }
          : task
      )
    }))
  },

  updateEnvironmentInfo: async () => {
    try {
      const envInfo = await VirtualLifeService.getEnvironmentInfo()
      set(() => ({
        environmentInfo: {
          location: envInfo.location,
          weather: envInfo.weather,
          festival: envInfo.festival,
          season: envInfo.season
        }
      }))
    } catch (error) {
      console.error('更新环境信息失败:', error)
    }
  },

  generateDynamicTask: async () => {
    try {
      const generatedTask = await VirtualLifeService.generateDynamicTask()
      
      // 将生成的任务转换为Task格式
      const newTask: Task = {
        id: `dynamic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: generatedTask.title,
        description: generatedTask.description,
        status: 'not_started',
        progress: 0,
        maxProgress: 1,
        reward: generatedTask.reward,
        timeLimit: generatedTask.duration * 60 * 60 * 1000, // 转换为毫秒
        locationId: 'beijing', // 默认位置，可以根据实际位置调整
        type: 'limited_time',
        isLimitedTime: true,
        isDynamic: true,
        generatedAt: Date.now(),
        weatherCondition: generatedTask.weatherCondition,
        festivalType: generatedTask.festivalType
      }

      set((state) => ({
        tasks: [...state.tasks, newTask]
      }))
    } catch (error) {
      console.error('生成动态任务失败:', error)
    }
  },

  removeExpiredDynamicTasks: () => {
    set((state) => ({
      tasks: state.tasks.filter((task) => {
        if (!task.isDynamic || !task.generatedAt || !task.timeLimit) {
          return true
        }
        
        const now = Date.now()
        const endTime = task.generatedAt + task.timeLimit
        return now <= endTime
      })
    }))
  }
}))
