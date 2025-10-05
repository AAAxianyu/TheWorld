# 虚拟人生探索系统

一个基于React和TypeScript的古风探索游戏，集成了高德地图API和星火大模型，能够根据用户位置、实时天气和节日情况动态生成限时任务。

## 功能特性

### 🌍 智能定位与天气
- **IP定位**：通过高德地图API自动获取用户所在城市
- **实时天气**：获取当前天气信息和未来预报
- **节日检测**：自动识别当前节日（春节、中秋、国庆等）
- **季节感知**：根据当前月份判断季节

### 🎯 动态任务生成
- **AI任务生成**：使用星火大模型X1根据天气和节日生成个性化任务
- **限时任务**：任务具有时间限制，增加游戏紧迫感
- **智能分类**：任务自动分类为天气相关、节日相关或季节相关
- **古风主题**：所有任务都融入古风文化元素

### 🏛️ 古风探索
- **历史名城**：北京、杭州、上海、南京等历史文化名城
- **名胜古迹**：紫禁城、西湖、外滩、夫子庙等著名景点
- **文化体验**：诗词创作、古建筑探索、传统文化学习
- **成就系统**：完成探索获得徽章和称号

## 技术架构

### 前端技术栈
- **React 18**：现代化的用户界面框架
- **TypeScript**：类型安全的JavaScript
- **Tailwind CSS**：实用优先的CSS框架
- **Framer Motion**：流畅的动画效果
- **Zustand**：轻量级状态管理
- **React Router**：单页应用路由

### API集成
- **高德地图API**：IP定位和天气查询
- **星火大模型X1**：AI任务生成
- **RESTful API**：标准化的API调用

## 快速开始

### 1. 安装依赖
```bash
npm install
# 或
pnpm install
```

### 2. 配置API密钥
复制 `env.example` 文件为 `.env.local` 并填入你的API密钥：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件：
```env
# 高德地图API密钥
VITE_AMAP_API_KEY=your_amap_api_key_here

# 星火大模型API密钥
VITE_SPARK_API_KEY=your_spark_api_key_here
```

### 3. 申请API密钥

#### 高德地图API
1. 访问 [高德开放平台](https://lbs.amap.com/dev/key/app)
2. 注册账号并创建应用
3. 获取Web服务API密钥
4. 确保开通了以下服务：
   - IP定位服务
   - 天气查询服务

#### 星火大模型API
1. 访问 [星火大模型官网](https://xinghuo.xfyun.cn/)
2. 注册账号并申请API访问权限
3. 获取API密钥
4. 确保有足够的API调用额度

### 4. 启动开发服务器
```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:5173` 查看应用。

## 使用说明

### 基本操作
1. **探索地图**：点击地图上的地点进行探索
2. **解锁地点**：点击未解锁的地点进行解锁
3. **查看天气**：右上角显示当前天气和位置信息
4. **生成任务**：点击"生成任务"按钮创建限时任务
5. **完成任务**：点击任务开始执行并获得奖励

### 动态任务系统
- **自动生成**：系统会根据当前天气和节日自动生成相关任务
- **手动生成**：用户可以手动点击生成新任务
- **冷却时间**：30分钟内只能生成一次新任务
- **任务过期**：动态任务会在24小时后自动过期

### 天气相关任务
- **晴天**：适合户外探索和古建筑参观
- **雨天**：雨中漫步、室内文化活动
- **雪天**：雪景欣赏、冬季特色活动
- **多云**：温和天气下的各种探索活动

### 节日相关任务
- **春节**：传统年俗体验、拜年活动
- **中秋**：赏月、诗词创作、月饼制作
- **国庆**：爱国主题探索、历史学习
- **其他节日**：根据节日特色生成相应任务

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── WeatherWidget.tsx      # 天气显示组件
│   ├── DynamicTaskWidget.tsx   # 动态任务组件
│   ├── Layout.tsx             # 布局组件
│   ├── TopNavigation.tsx      # 顶部导航
│   └── BottomNavigation.tsx   # 底部导航
├── pages/              # 页面目录
│   ├── HomePage.tsx           # 首页
│   ├── TasksPage.tsx          # 任务页面
│   ├── AchievementsPage.tsx   # 成就页面
│   └── ...
├── services/          # 服务目录
│   └── api.ts                # API服务模块
├── store/             # 状态管理
│   └── gameStore.tsx         # 游戏状态
├── hooks/             # 自定义钩子
│   └── useAuth.ts           # 认证钩子
└── lib/               # 工具库
    └── lumi.ts              # Lumi SDK
```

## API接口说明

### 高德地图API

#### IP定位
```javascript
GET https://restapi.amap.com/v3/ip?key={API_KEY}
```

#### 天气查询
```javascript
GET https://restapi.amap.com/v3/weather/weatherInfo?city={adcode}&key={API_KEY}&extensions=all
```

### 星火大模型API

#### 任务生成
```javascript
POST https://spark-api-open.xf-yun.com/v2/chat/completions
Content-Type: application/json
Authorization: Bearer {API_KEY}

{
  "model": "x1",
  "user": "user_123456",
  "messages": [
    {
      "role": "user",
      "content": "根据今天的天气和节日生成古风探索任务"
    }
  ],
  "stream": false
}
```

## 开发指南

### 添加新的地点
在 `src/store/gameStore.tsx` 中的 `locations` 数组添加新地点：

```typescript
{
  id: 'new_location',
  name: '新地点',
  type: 'temple',
  unlocked: false,
  x: 50,
  y: 50,
  description: '地点描述',
  tasks: ['task_id'],
  events: ['event_id'],
  parentCity: 'beijing'
}
```

### 添加新的任务类型
在 `src/services/api.ts` 中扩展任务类型：

```typescript
export interface GeneratedTask {
  // ... 现有字段
  newType?: string // 新任务类型
}
```

### 自定义天气图标
在 `src/components/WeatherWidget.tsx` 中修改 `getWeatherIcon` 函数：

```typescript
const getWeatherIcon = (weather: string) => {
  if (weather.includes('晴')) return <Sun className="w-6 h-6 text-yellow-500" />
  // 添加新的天气条件
  if (weather.includes('雾')) return <Cloud className="w-6 h-6 text-gray-400" />
  // ...
}
```

## 部署说明

### 构建生产版本
```bash
npm run build
# 或
pnpm build
```

### 环境变量配置
确保在生产环境中正确配置API密钥：

```env
VITE_AMAP_API_KEY=your_production_amap_key
VITE_SPARK_API_KEY=your_production_spark_key
```

### 部署到Vercel
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

## 故障排除

### 常见问题

#### 1. API调用失败
- 检查API密钥是否正确
- 确认API服务是否已开通
- 检查网络连接

#### 2. 天气信息不显示
- 确认高德地图API密钥有效
- 检查IP定位服务是否正常
- 查看浏览器控制台错误信息

#### 3. 任务生成失败
- 确认星火大模型API密钥有效
- 检查API调用额度是否充足
- 确认网络连接正常

#### 4. 位置信息不准确
- 高德地图IP定位可能存在偏差
- 可以手动设置默认城市

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 创建 Issue
- 发送邮件
- 提交 Pull Request

---

**注意**：使用本系统需要申请相应的API密钥，请确保遵守各API服务商的使用条款和限制。