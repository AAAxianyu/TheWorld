// 西湖诗词创作任务系统

// 任务阶段枚举
export enum TaskStage {
  POETRY_RIDDLE = 'poetry_riddle',      // 诗句接龙
  POET_EXPLORATION = 'poet_exploration', // 诗人探索
  POETRY_CREATION = 'poetry_creation'    // 诗词创作
}

// 任务状态枚举
export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LOCKED = 'locked'
}

// 诗句接龙题目
export interface PoetryRiddle {
  id: string
  question: string
  correctAnswer: string
  alternatives: string[]
  hint: string
  explanation: string
}

// 诗人信息
export interface Poet {
  id: string
  name: string
  dynasty: string
  description: string
  westLakePoems: string[]
  keyClues: string[]
  personality: string
}

// 诗词创作主题
export interface PoetryTheme {
  id: string
  name: string
  description: string
  keywords: string[]
  emotions: string[]
  examples: string[]
}

// 用户创作的诗
export interface UserPoetry {
  id: string
  title: string
  content: string
  theme: string
  keywords: string[]
  emotions: string[]
  aiScore: number
  createdAt: Date
  backgroundImage?: string
}

// 西湖诗词任务
export interface WestLakePoetryTask {
  id: string
  title: string
  description: string
  locationId: string
  currentStage: TaskStage
  stages: {
    [TaskStage.POETRY_RIDDLE]: {
      status: TaskStatus
      progress: number
      maxProgress: number
      riddles: PoetryRiddle[]
      currentRiddleIndex: number
      correctAnswers: number
      unlockedAt?: Date
    }
    [TaskStage.POET_EXPLORATION]: {
      status: TaskStatus
      progress: number
      maxProgress: number
      poets: Poet[]
      currentPoetId?: string
      discoveredClues: string[]
      unlockedAt?: Date
    }
    [TaskStage.POETRY_CREATION]: {
      status: TaskStatus
      progress: number
      maxProgress: number
      themes: PoetryTheme[]
      selectedTheme?: string
      userPoetry?: UserPoetry
      aiScore: number
      unlockedAt?: Date
    }
  }
  rewards: {
    poetryDoor: boolean
    poetCard: boolean
    westLakeBadge: boolean
    poetryValue: number
    culturePoints: number
  }
  createdAt: Date
  completedAt?: Date
}

// AI角色配置
export interface AICharacter {
  id: string
  name: string
  title: string
  personality: string
  avatar: string
  voiceStyle: string
  greetings: string[]
  responses: {
    [key: string]: string[]
  }
}

// 西湖诗库
export const WEST_LAKE_POETRY_DATABASE = {
  riddles: [
    {
      id: 'riddle_1',
      question: '欲把西湖比西子，——',
      correctAnswer: '淡妆浓抹总相宜',
      alternatives: ['浓妆淡抹总相宜', '淡妆浓抹总相宜', '浓妆淡抹总相宜'],
      hint: '这是苏轼的名句，形容西湖的美貌',
      explanation: '苏轼在《饮湖上初晴后雨》中将西湖比作西施，无论淡妆还是浓妆都很美'
    },
    {
      id: 'riddle_2',
      question: '接天莲叶无穷碧，——',
      correctAnswer: '映日荷花别样红',
      alternatives: ['映日荷花别样红', '映日荷花别样红', '映日荷花别样红'],
      hint: '杨万里的诗句，描写荷花在阳光下的美丽',
      explanation: '杨万里《晓出净慈寺送林子方》中的名句，描绘了西湖荷花的壮丽景色'
    },
    {
      id: 'riddle_3',
      question: '山外青山楼外楼，——',
      correctAnswer: '西湖歌舞几时休',
      alternatives: ['西湖歌舞几时休', '西湖歌舞几时休', '西湖歌舞几时休'],
      hint: '林升的诗句，表达了对南宋偏安的感慨',
      explanation: '林升《题临安邸》中的名句，讽刺了南宋朝廷的醉生梦死'
    }
  ],
  poets: [
    {
      id: 'poet_sushi',
      name: '苏轼',
      dynasty: '北宋',
      description: '字子瞻，号东坡居士，北宋文学家、书画家',
      westLakePoems: ['饮湖上初晴后雨', '六月二十七日望湖楼醉书'],
      keyClues: ['饮湖上初晴后雨', '淡妆浓抹总相宜', '东坡居士'],
      personality: '豪放洒脱，热爱自然，善于发现生活中的美'
    },
    {
      id: 'poet_bai_juyi',
      name: '白居易',
      dynasty: '唐代',
      description: '字乐天，号香山居士，唐代现实主义诗人',
      westLakePoems: ['钱塘湖春行', '西湖晚归回望孤山寺赠诸客'],
      keyClues: ['钱塘湖春行', '最爱湖东行不足', '香山居士'],
      personality: '关注民生，热爱自然，诗歌通俗易懂'
    },
    {
      id: 'poet_yang_wanli',
      name: '杨万里',
      dynasty: '南宋',
      description: '字廷秀，号诚斋，南宋诗人',
      westLakePoems: ['晓出净慈寺送林子方', '西湖晚归'],
      keyClues: ['晓出净慈寺送林子方', '接天莲叶无穷碧', '诚斋'],
      personality: '清新自然，善于描写田园风光，语言生动活泼'
    }
  ],
  themes: [
    {
      id: 'theme_sunny',
      name: '晴日西湖',
      description: '阳光明媚的西湖，波光粼粼，游人如织',
      keywords: ['阳光', '波光', '游船', '柳絮', '荷花'],
      emotions: ['愉悦', '闲适', '赞美', '欣赏'],
      examples: ['欲把西湖比西子，淡妆浓抹总相宜']
    },
    {
      id: 'theme_rainy',
      name: '烟雨西湖',
      description: '细雨蒙蒙的西湖，如诗如画，意境深远',
      keywords: ['细雨', '烟波', '朦胧', '诗意', '意境'],
      emotions: ['思念', '忧郁', '浪漫', '怀古'],
      examples: ['山色空蒙雨亦奇']
    },
    {
      id: 'theme_night',
      name: '夜泊西湖',
      description: '夜晚的西湖，宁静致远，月影婆娑',
      keywords: ['月光', '夜色', '宁静', '月影', '星光'],
      emotions: ['宁静', '思念', '孤独', '感悟'],
      examples: ['月落乌啼霜满天，江枫渔火对愁眠']
    }
  ]
}

// AI角色配置
export const AI_CHARACTERS = {
  yin_feng: {
    id: 'yin_feng',
    name: '吟风',
    title: '西湖诗灵',
    personality: '温文尔雅，博学多才，善于引导和启发',
    avatar: '🌸',
    voiceStyle: '温和而富有诗意',
    greetings: [
      '听闻你心向西湖，可识这湖光山色下的诗意？',
      '西湖之美，在于诗意，你准备好了吗？',
      '让我们一同探索西湖的诗意世界'
    ],
    responses: {
      correct: [
        '妙哉！你已听懂西湖的风声',
        '诗心相通，你果然有诗人的天赋',
        '西湖的诗意在你心中流淌'
      ],
      incorrect: [
        '似乎少了几分荷香，再想想？',
        '诗意的路上需要更多的感悟',
        '让我们重新品味这诗句的韵味'
      ],
      encouragement: [
        '不要灰心，诗意的探索需要耐心',
        '每一次尝试都是对诗意的理解',
        '西湖的诗意永远为你敞开'
      ]
    }
  }
}

// 任务配置
export const WEST_LAKE_POETRY_TASK_CONFIG: WestLakePoetryTask = {
  id: 'west_lake_poetry_task',
  title: '西湖诗词创作',
  description: '通过AI互动式问答与创作，了解西湖相关的诗词、诗人及文化背景',
  locationId: 'west_lake',
  currentStage: TaskStage.POETRY_RIDDLE,
  stages: {
    [TaskStage.POETRY_RIDDLE]: {
      status: TaskStatus.NOT_STARTED,
      progress: 0,
      maxProgress: 2,
      riddles: WEST_LAKE_POETRY_DATABASE.riddles,
      currentRiddleIndex: 0,
      correctAnswers: 0,
      unlockedAt: undefined
    },
    [TaskStage.POET_EXPLORATION]: {
      status: TaskStatus.LOCKED,
      progress: 0,
      maxProgress: 1,
      poets: WEST_LAKE_POETRY_DATABASE.poets,
      currentPoetId: undefined,
      discoveredClues: [],
      unlockedAt: undefined
    },
    [TaskStage.POETRY_CREATION]: {
      status: TaskStatus.LOCKED,
      progress: 0,
      maxProgress: 1,
      themes: WEST_LAKE_POETRY_DATABASE.themes,
      selectedTheme: undefined,
      userPoetry: undefined,
      aiScore: 0,
      unlockedAt: undefined
    }
  },
  rewards: {
    poetryDoor: false,
    poetCard: false,
    westLakeBadge: false,
    poetryValue: 0,
    culturePoints: 0
  },
  createdAt: new Date(),
  completedAt: undefined
}
