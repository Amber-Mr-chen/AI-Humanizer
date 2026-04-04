# AI Humanizer MVP 需求文档

**项目名称：** AI Humanizer  
**域名：** aihumanizer.life  
**版本：** v1.0 MVP  
**日期：** 2026-04-04  
**目标：** 1年内实现盈利，订阅制变现

---

## 一、产品定位

### 核心价值
将 AI 生成的文字改写成更自然、更像人类写作风格的内容，帮助用户绕过 AI 检测工具。

### 目标用户
- 学生：用 AI 写作业/论文后需要"人性化"处理
- 内容创作者：批量生产 SEO 内容后需要去AI痕迹
- SEO 写手：需要大量自然风格文字
- 自媒体运营者：用 AI 生成内容但担心被平台检测

### 市场机会
- Google Trends 7天飙升热词：grammarly ai humanizer、gptinf humanizer、rephrasy ai
- 现有竞品（QuillBot、Undetectable AI）均收费且限制严格
- 用户在持续寻找更好的免费/低价替代品

---

## 二、用户分层

| 用户类型 | 条件 | 每日限额 | 功能权限 |
|--|--|--|--|
| 游客 | 未登录 | 300字符/天（按IP） | 基础模式 |
| 免费用户 | Google登录 | 1000字符/天 | 基础模式 + 历史记录 |
| Pro用户 | 订阅付费 | 无限字符 | 全部模式 + 优先处理 |
| 管理员 | 硬编码邮箱 | 无限 | 全部功能 |

---

## 三、核心功能（MVP范围）

### 3.1 Humanizer 工具（首页，核心）

**输入：**
- 文本输入框（粘贴AI生成文字）
- 最大输入：游客300字符，免费1000字符，Pro无限
- 字符计数实时显示
- 剩余额度显示（今日已用 / 今日限额）

**输出：**
- 改写后文字展示框
- 一键复制按钮
- 字符数对比（输入 vs 输出）

**模式选择（3种）：**
- Standard（标准）：通用改写，自然流畅
- Academic（学术）：适合论文、报告，正式但不机械
- Creative（创意）：更生动、更有个性，适合博客/社媒

**操作流程：**
1. 用户粘贴文字
2. 选择模式
3. 点击"Humanize"按钮
4. 显示 loading 动画
5. 输出改写结果
6. 可一键复制

**额度超限处理：**
- 游客超限 → 弹窗"登录获取更多额度"
- 免费用户超限 → 弹窗"升级Pro获取无限额度"

### 3.2 用户系统

**登录方式：**
- Google OAuth（唯一登录方式，简单快速）

**登录后功能：**
- 查看今日剩余额度
- 查看历史记录（最近20条）
- 查看订阅状态

**新用户福利：**
- 注册即送3天Pro试用（降低付费门槛）

### 3.3 订阅付费

**定价方案：**
- Free：$0，1000字符/天
- Pro Monthly：$9.99/月（展示价$14.99，优惠价$9.99，节省33%）
- Pro Yearly：$59.99/年（展示价$99.99，优惠价$59.99，节省40%）

**支付方式：** PayPal 订阅

**Pro到期处理：**
- 到期前3天发提醒邮件（Resend）
- 到期后自动降级为免费用户

### 3.4 历史记录

- 仅登录用户可用
- 显示最近20条记录
- 每条记录：时间、模式、输入摘要（前50字）、输出摘要（前50字）
- MVP不做分页

### 3.5 定价页

- Free vs Pro功能对比表
- PayPal订阅按钮
- FAQ（常见问题）
- "LIMITED TIME OFFER"促销氛围

---

## 四、页面结构

```
/ (首页 = 工具主页)
/pricing (定价页)
/history (历史记录，需登录)
/api/humanize (POST，核心API)
/api/auth/[...nextauth] (Google OAuth)
/api/paypal/create-subscription
/api/paypal/webhook
/api/cron/expiry (Pro到期处理)
```

---

## 五、技术架构

### 技术栈
- **框架：** Next.js 15 (App Router)
- **部署：** Cloudflare Workers via @opennextjs/cloudflare
- **数据库：** Cloudflare D1（SQLite）
- **AI模型：** Cloudflare Workers AI（主）/ Claude Haiku备用
- **认证：** NextAuth.js + Google OAuth
- **支付：** PayPal Subscriptions API
- **邮件：** Resend
- **样式：** Tailwind CSS

### Cloudflare 资源
- Worker 名称：`ai-humanizer`
- D1 数据库名：`ai-humanizer-db`
- 自定义域名：`aihumanizer.life`

### 数据库表结构

```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  plan TEXT DEFAULT 'free', -- free | pro
  pro_expires_at INTEGER,   -- Unix timestamp
  trial_used INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- 用量表（每日重置）
CREATE TABLE usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  ip TEXT,
  date TEXT NOT NULL,       -- YYYY-MM-DD
  char_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date),
  UNIQUE(ip, date)
);

-- 历史记录表
CREATE TABLE history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  char_count INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

-- 订阅表
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  paypal_sub_id TEXT,
  status TEXT,              -- active | cancelled | expired
  plan_type TEXT,           -- monthly | yearly
  created_at INTEGER DEFAULT (unixepoch()),
  expires_at INTEGER
);
```

---

## 六、AI Prompt 设计

### Standard 模式
```
You are a writing assistant. Rewrite the following AI-generated text to sound more natural and human-written. 
Rules:
- Keep the original meaning completely intact
- Use varied sentence lengths (mix short and long)
- Add natural transitions and connective words
- Avoid overly perfect or formulaic structures
- Use occasional contractions (it's, don't, etc.)
- Output only the rewritten text, no explanations.

Text to rewrite:
{input}
```

### Academic 模式
```
You are an academic writing assistant. Rewrite the following text to sound like it was written by a knowledgeable human student or researcher.
Rules:
- Maintain academic tone but avoid robotic perfection
- Use varied sentence structures
- Include natural academic transitions
- Keep all original arguments and facts
- Output only the rewritten text, no explanations.

Text to rewrite:
{input}
```

### Creative 模式
```
You are a creative writing assistant. Rewrite the following text with more personality, warmth, and human flair.
Rules:
- Make it engaging and relatable
- Add natural personality without changing core meaning
- Use vivid but simple language
- Vary rhythm and sentence flow
- Output only the rewritten text, no explanations.

Text to rewrite:
{input}
```

---

## 七、SEO 策略

### 核心关键词
- 主词：`ai humanizer`（最高搜索量）
- 长尾词：`free ai humanizer`、`ai humanizer online`、`humanize ai text`

### 页面 SEO
- 首页 title：`AI Humanizer - Free Online Tool to Humanize AI Text`
- 首页 description：`Free AI Humanizer tool. Make AI-generated text undetectable. Paste your AI content and get natural, human-like text instantly.`
- 添加 JSON-LD 结构化数据（WebApplication类型）
- sitemap.xml + robots.txt
- Canonical 标签

---

## 八、MVP 排除功能（v2再做）

- AI Detector（检测文字是否AI生成）
- 批量处理
- API接口（开放给开发者）
- 多语言支持
- Chrome 插件
- 积分系统
- 推荐奖励计划

---

## 九、上线检查清单

- [ ] Cloudflare Worker 部署成功
- [ ] D1 数据库创建并初始化
- [ ] 自定义域名 aihumanizer.life 绑定
- [ ] Google OAuth 配置（回调URL加入aihumanizer.life）
- [ ] PayPal 订阅计划创建（月付+年付）
- [ ] PayPal Webhook 配置
- [ ] Resend 域名验证（aihumanizer.life）
- [ ] 首页工具可用
- [ ] 游客限流正常
- [ ] 免费用户限流正常
- [ ] Pro订阅流程跑通
- [ ] Pro到期邮件发送正常
- [ ] sitemap 提交 Google Search Console
- [ ] Google Analytics 接入

---

## 十、开发优先级（MVP阶段）

| 优先级 | 功能 | 预计工时 |
|--|--|--|
| P0 | 首页Humanizer工具 + AI API | 1天 |
| P0 | Cloudflare Worker部署 + 域名绑定 | 半天 |
| P1 | Google登录 + D1用户表 | 半天 |
| P1 | 用量限制（游客IP + 登录用户） | 半天 |
| P1 | 定价页 + PayPal订阅 | 1天 |
| P2 | 历史记录页 | 半天 |
| P2 | Pro到期提醒邮件 | 半天 |
| P2 | SEO优化 | 半天 |

**预计总工时：5-6天**

---

*文档版本：v1.0 | 最后更新：2026-04-04*
