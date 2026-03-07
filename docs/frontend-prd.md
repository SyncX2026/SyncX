你是一名资深的产品设计师、品牌设计师和前端工程师。请为一个名为「SyncX」的 skill 产品，设计并实现一个高质量、可运行、可直接展示的官方网站。

目标不是做复杂后台或功能系统，而是做一个“像真正产品官网”的展示站点：
- 有专业感
- 有完成度
- 有品牌气质
- 有明确的信息架构
- 有克制但高级的 GSAP 动效
- 能让人一眼看懂这个 skill 是做什么的、怎么用、为什么专业

请直接输出完整可运行代码，不要只给设计说明。

==================================================
一、项目背景
==================================================

产品名称：
- SyncX

中文名称：
- 加密信息一站式同步器

产品定位：
这是一个面向加密内容创作者的 automation skill。
它的核心能力是：
- 一次输入一条文本内容
- 同步发布到多个平台
- 默认核心平台是 Binance Square 和 X / Twitter
- 可选扩展到 Telegram 和 Threads

典型用户：
- Crypto Twitter 创作者
- Binance Square 创作者
- 币圈 KOL / 研究员 / 项目方运营
- 需要把同一条内容分发到多个平台的人

核心价值：
- 减少重复搬运
- 提升分发效率
- 保持统一发布流程
- 配置、自检、发布形成闭环

注意：
- 这不是交易产品
- 这不是内容编辑器
- 这不是复杂 SaaS 后台
- 这不是社交平台本身
- 这是一个“多平台同步发布 skill”的官网展示站

==================================================
二、网站目标
==================================================

请围绕下面目标设计和实现网站：

1. 让用户一眼明白这是什么
2. 让用户快速理解怎么使用
3. 让网站看起来像真正的成熟产品
4. 让视觉调性贴近“Binance Square 品牌延展风格”
5. 通过终端命令展示建立技术可信度
6. 用少量但精致的页面形成完整产品感
7. 动效要高级、克制、真实可运行，不要廉价炫技

==================================================
三、整体策略
==================================================

请采用“轻量多页”的最佳实践，而不是只做一个首屏壳子，也不要做成臃肿的大站。

推荐做 5 个页面：
- `/` Home
- `/workflow` How It Works
- `/commands` Commands
- `/platforms` Platforms
- `/faq` FAQ

设计原则：
- 首页最强，承担品牌感和第一印象
- Workflow 页面把使用流程讲清楚
- Commands 页面强化“真的能用”的感觉
- Platforms 页面把支持平台与模式讲清楚
- FAQ 页面提升完整度和可信度

每个页面都要轻量，不要堆很多内容，不要变成文档站。
页面数量可以有，但每一页都要克制、专业、清晰。

==================================================
四、视觉与品牌方向
==================================================

请做成偏 Binance Square 延展气质的官网，但不要直接照搬原站。

整体视觉关键词：
- dark premium
- crypto-native
- terminal-inspired
- refined
- structured
- trustworthy
- editorial SaaS

主色方向：
- 背景：黑色 / 深石墨灰 / 深蓝灰
- 主强调色：Binance 风格金黄色
- 辅助色：冷白、低饱和浅灰
- 状态色：少量柔和绿色 / 冰蓝，仅用于状态标签和小面积点缀

必须避免：
- 不要紫色 AI 渐变风
- 不要“科技感泛滥”的俗套视觉
- 不要大量玻璃模糊堆砌
- 不要复杂插画
- 不要交易所首页风格
- 不要 dashboard 化
- 不要模板拼接感

视觉细节要求：
- 顶部导航简洁
- 大面积留白和深色背景要有层次
- 页面背景可使用极淡网格纹理
- 可加入轻微噪点纹理
- 卡片圆角较大，但边框细腻克制
- 按钮要有明显的黄黑对比，质感强
- 终端区块必须足够真实
- 模块节奏清楚，有轻重层次
- 首页 Hero 最强
- Commands 页面次强
- Workflow 页面第三强

排版与字体：
- 字体要现代、利落、可信
- 标题有力量，但不要像营销广告
- 正文简洁，面向懂工具的人说话
- 中文为主，英文为辅
- 语气专业、克制、清晰，不夸张

==================================================
五、动效策略
==================================================

必须使用：
- GSAP
- GSAP ScrollTrigger

但请遵守“高级、克制、可维护、性能优先”的原则。

动效目标：
- 提升品牌质感
- 增强层次与阅读节奏
- 强化重要模块进入视口时的存在感
- 不做廉价炫技

请实现这些核心动效：

1. 首页 Hero 入场
- 标题、说明、按钮、右侧终端面板 stagger reveal
- 使用 opacity + y 位移 + 微弱 blur 过渡
- 背景可有极弱光晕漂浮或层次移动

2. Navbar 滚动状态
- 初始透明
- 滚动后变为半透明深色背景，带轻微 blur 和边框
- 过渡自然

3. 首页卡片与区块 reveal
- Overview、Preview、CTA 区块进入视口时逐步淡入上移
- 使用 stagger，但节奏克制

4. Workflow 页面流程动画
- 每个步骤卡片进入视口时依次 reveal
- 流程线可随着滚动轻微推进
- 桌面端更有仪式感，移动端改为简洁版本

5. Commands 页面终端动画
- 命令面板滚动进入时轻微 scale + fade
- 命令切换时有平滑内容切换
- 可以逐行 reveal，但不要做夸张打字机

6. Platforms 页面卡片矩阵
- 卡片交错出现
- hover 轻微上浮、边框高亮、阴影增强

7. CTA 区块
- 有轻微视差感或背景层缓慢移动
- 不影响阅读，不影响性能

动效限制：
- 不要全页面无处不动
- 不要高频 bouncing
- 不要过度 blur
- 不要影响滚动流畅度
- 优先使用 transform 和 opacity
- 为所有 ScrollTrigger 做正确 cleanup
- 兼容 prefers-reduced-motion

==================================================
六、技术栈与工程要求
==================================================

请用以下技术栈实现：

- Next.js 14+
- App Router
- TypeScript
- Tailwind CSS
- GSAP
- ScrollTrigger

要求：
- 响应式布局
- SEO 基础 metadata
- 代码结构清晰
- 组件化合理，但不要拆得过碎
- 文案先写死在代码中，不需要 CMS
- 不需要登录
- 不需要后端
- 不需要 API
- 不需要表单提交
- 页面要能直接运行
- 适当考虑可访问性
- 支持移动端

请注意：
- 首页和子页面共享统一视觉系统
- 需要有统一的按钮、卡片、标签、终端组件
- 尽量在 `lib/content.ts` 中统一维护文案内容
- 动效逻辑封装在 hook 或 util 中，避免散落重复

==================================================
七、推荐目录结构
==================================================

请按这个结构生成项目：

apps/web/
  app/
    layout.tsx
    page.tsx
    workflow/
      page.tsx
    commands/
      page.tsx
    platforms/
      page.tsx
    faq/
      page.tsx
    globals.css
  components/
    layout/
      navbar.tsx
      footer.tsx
      page-shell.tsx
    home/
      hero.tsx
      overview.tsx
      workflow-preview.tsx
      command-preview.tsx
      cta-banner.tsx
    workflow/
      workflow-hero.tsx
      workflow-steps.tsx
      workflow-detail.tsx
    commands/
      commands-hero.tsx
      command-tabs.tsx
      terminal-showcase.tsx
    platforms/
      platforms-hero.tsx
      platform-grid.tsx
      mode-explainer.tsx
    faq/
      faq-hero.tsx
      faq-list.tsx
    ui/
      button.tsx
      badge.tsx
      section-heading.tsx
      card.tsx
      terminal-window.tsx
      status-pill.tsx
      grid-background.tsx
  hooks/
    use-gsap-reveal.ts
    use-navbar-scroll.ts
    use-prefers-reduced-motion.ts
  lib/
    content.ts
    gsap.ts
    utils.ts
  public/
    grid.svg
    noise.png
  package.json
  tailwind.config.ts
  tsconfig.json
  postcss.config.js

如果你认为可以更优，可以微调，但不要偏离这个层级太多。

==================================================
八、页面信息架构
==================================================

----------------------------------
1. Home `/`
----------------------------------

这是最重要的页面，承担第一印象和品牌建立。

模块建议：

A. Navbar
- Logo / 产品名
- Home
- Workflow
- Commands
- Platforms
- FAQ
- 右侧 CTA 按钮

B. Hero
目标：
- 一眼看懂是什么
- 看起来像真实产品官网

建议文案：
- Eyebrow: For Crypto Creators
- 标题：一次输入，同步发布到 Binance Square 与 X
- 副标题：SyncX 是一个面向加密内容创作者的一站式同步发布 skill，把重复搬运变成一次命令完成的工作流。
- 主按钮：查看使用方式
- 次按钮：命令示例

Hero 右侧或下方必须有一个高级的终端 + 状态面板：
建议内容：
- square: ready
- twitter official: ready
- twitter browser: alternate
- tg: optional
- threads: optional

同时展示一小段 JSON 风格结果或命令输出，让它更像真实工具，而不是纯装饰。

C. Overview
标题建议：
- 为内容同步发布而生

3 张卡片即可：
- 一次输入，多端同步
- 默认主打 Binance Square + X
- 配置、自检、发布一条链路完成

D. Workflow Preview
标题建议：
- 清晰的发布闭环

4 个步骤预览：
1. 初始化配置
2. 填写平台凭证
3. 运行 doctor 自检
4. 执行同步发布

E. Command Preview
标题建议：
- 命令级工作流，一眼看懂怎么用

展示 2 到 3 个核心命令卡片，附一个“查看完整命令页”的 CTA。

F. Final CTA
标题建议：
- 让你的内容发布流程，像命令一样稳定
副标题：
- 面向 Binance Square 与 Crypto Twitter 创作者的同步发布工作流
按钮：
- 查看使用方式
- 浏览命令示例

----------------------------------
2. Workflow `/workflow`
----------------------------------

目标：
- 把使用过程讲清楚
- 建立“可执行、可操作”的信任感

模块建议：

A. Hero
- 标题：4 步完成一次同步发布
- 副标题：从配置初始化到正式发布，整个流程保持简单、明确、可验证。

B. Step Section
依次展示：
1. 初始化本地配置
文案：
运行初始化命令，生成本地 `.env` 模板，为后续平台接入做好准备。

2. 填写平台凭证
文案：
配置 Binance Square、X、Telegram、Threads 所需凭证，默认以 Square 与 X 为核心发布组合。

3. 运行 doctor 自检
文案：
在发布前检查缺失项与环境问题，降低实际发布时的失败率。

4. 执行同步发布
文案：
输入一条内容，指定平台组合，一次命令完成多端分发。

C. Supporting Detail
补充说明：
- 默认平台：square,twitter
- 默认 twitter-mode：official
- browser 模式作为备选
- 部分失败不阻塞整体流程

----------------------------------
3. Commands `/commands`
----------------------------------

目标：
- 通过真实命令建立专业感
- 让人感觉这不是概念页，而是真工具

模块建议：

A. Hero
- 标题：真实命令，而不是概念展示
- 副标题：从配置、自检到正式发布，整个工作流都可以直接用命令驱动。

B. Command Tabs / Terminal Showcase
必须展示这些命令：

1. 初始化配置
python3 scripts/publish_sync.py --init-config

2. doctor 自检
python3 scripts/publish_sync.py --doctor --platforms square,twitter --twitter-mode official

3. 默认发布到 Binance Square + X
python3 scripts/publish_sync.py --text "BTC 回踩后继续上攻，关注 4h 结构" --platforms square,twitter --twitter-mode official

4. 使用浏览器模式发布 X
python3 scripts/publish_sync.py --text "今日策略更新：严格风控" --platforms square,twitter --twitter-mode browser

5. 发布到 Square + X + Telegram
python3 scripts/publish_sync.py --text "晚间复盘：BTC 关键位 68k" --platforms square,twitter,tg --twitter-mode official

请把这些内容做成高级终端窗口：
- 有 tab 或切换器
- 有仿终端头部
- 有行号或输出区
- 视觉真实
- 支持切换不同场景

C. Supporting Copy
强调：
- 命令统一
- 流程清晰
- 默认配置合理
- 适合日常内容分发使用

----------------------------------
4. Platforms `/platforms`
----------------------------------

目标：
- 清楚解释支持哪些平台、模式有什么区别

模块建议：

A. Hero
- 标题：支持的平台与发布模式
- 副标题：围绕 Binance Square 与 X 构建默认工作流，并提供可扩展的分发路径。

B. Platform Grid
卡片内容建议：

1. Binance Square
- 标签：default
- 描述：官方 OpenAPI 文本发布，作为核心目标平台之一。

2. X / Twitter Official
- 标签：default
- 描述：基于官方 API v2 的标准发布路径，适合稳定接入。

3. X / Twitter Browser Mode
- 标签：alternate
- 描述：基于浏览器会话的备用模式，用于特定场景下的发布需求。

4. Telegram
- 标签：optional
- 描述：通过 Bot API 推送到频道、群组或聊天。

5. Threads
- 标签：optional
- 描述：作为可选扩展渠道纳入统一分发流程。

C. Mode Explainer
增加一块简短说明：
- default：默认推荐路径
- alternate：备用路径
- optional：可选扩展路径

----------------------------------
5. FAQ `/faq`
----------------------------------

目标：
- 提升完整度
- 回答常见疑问
- 补足信任感

建议问题：

1. 这个工具适合谁？
答：
适合长期在 Binance Square 与 X 发布内容的加密创作者、研究员、KOL 和运营团队。

2. 默认会发布到哪些平台？
答：
默认以 Binance Square 和 X / Twitter 为核心发布组合。

3. X 支持哪些接入方式？
答：
支持官方 API 模式，也支持浏览器会话模式作为备选。

4. 可以只发单个平台吗？
答：
可以。平台组合可以按需指定，不必每次都全量分发。

5. 发布失败后怎么排查？
答：
建议先运行 doctor 自检，再做 dry-run 或单平台测试，逐步定位具体问题。

6. 是否会暴露 API key 或 token？
答：
不会。设计上应避免回显完整敏感信息，并优先在本地 `.env` 中管理配置。

==================================================
九、统一文案风格要求
==================================================

文案风格：
- 中文为主，英文为辅
- 专业
- 克制
- 简洁
- 不夸张
- 不像营销海报
- 不像面向小白的流量广告
- 像在对懂内容分发、懂效率、懂 crypto 的用户讲话

请避免：
- 夸大承诺
- 浮夸口号
- 空泛抽象词过多
- “革命性”“颠覆性”之类的表达
- 太像 AI 套路文案

==================================================
十、组件与设计系统要求
==================================================

请做统一的设计系统：

1. Button
- 主按钮：Binance 黄底黑字
- 次按钮：深色描边 / 半透明底
- hover、active、focus 状态完整

2. Badge / Status Pill
- default / optional / alternate
- 颜色区分清楚，但保持高级感

3. Card
- 用统一卡片样式
- 统一圆角、边框、背景、hover

4. Terminal Window
- 复用终端组件
- 可显示标题、tab、命令行、输出
- 用于 Home 和 Commands 页面

5. Section Heading
- 每个页面统一标题结构
- eyebrow + title + description

==================================================
十一、工程与质量要求
==================================================

请确保：

- 所有页面和组件都能正常运行
- 没有明显的空组件或 TODO
- GSAP 动效真实可运行
- ScrollTrigger 使用方式正确
- 页面在移动端和桌面端都可用
- 有合理的语义化标签
- 避免重复代码
- 尽量将内容与表现分离
- 代码风格整洁，便于后续继续扩展
- 适当处理 reduced motion
- 注意 hydration 安全与客户端组件边界

==================================================
十二、输出要求
==================================================

请直接输出完整项目代码，不要只给解释。
输出时请：

1. 先给出完整目录树
2. 然后逐个文件输出完整内容
3. 保证依赖完整
4. 保证可以直接安装运行
5. 不要留伪代码
6. 不要只输出部分文件
7. 不要偷懒省略样式和动效实现

最终结果应该像一个成熟产品官网，而不是模板页、演示页或概念图。
请开始生成 `apps/web/` 目录下的完整代码。