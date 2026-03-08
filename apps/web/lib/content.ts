export const CONTENT = {
  home: {
    hero: {
      eyebrow: "Multi-platform Crypto Publishing",
      title: "Sync once, publish everywhere.",
      subtitle:
        "SyncX 帮助加密内容创作者将影响力一键同步到 X、币安广场 与更多平台。把重复搬运变成一次命令完成的工作流。",
      primaryCta: "查看使用方式",
      secondaryCta: "命令示例",
      publisherCta: "网页发布器",
      terminal: {
        status: {
          square: "ready",
          twitter_official: "ready",
          twitter_browser: "alternate",
          tg: "optional",
          threads: "optional",
        },
        output: [
          "> Initializing SyncX sequence...",
          "> Loading configuration from .env",
          "> [SUCCESS] Binance Square client connected",
          "> [SUCCESS] Twitter V2 client connected",
          "> Content length: 238 chars",
          "> Publishing to [square, twitter]...",
          "> [DONE] Square post ID: 183920482",
          "> [DONE] Tweet ID: 173829102938",
          "> Broadcast completed in 1.2s",
        ],
      },
    },
    overview: {
      title: "为内容同步发布而生",
      cards: [
        {
          title: "一次输入，多端同步",
          description: "告别复制粘贴，一条内容自动分发到所有目标平台。",
        },
        {
          title: "默认主打 Binance Square + X",
          description: "深度优化两大核心加密社区的发布体验与格式兼容。",
        },
        {
          title: "配置、自检、发布闭环",
          description: "从环境配置到健康检查，确保每一次发布都准确无误。",
        },
      ],
    },
    workflowPreview: {
      title: "清晰的发布闭环",
      steps: [
        "初始化配置",
        "填写平台凭证",
        "运行 doctor 自检",
        "执行同步发布",
      ],
    },
    commandPreview: {
      title: "命令级工作流，一眼看懂怎么用",
      cta: "查看完整命令页",
      commands: [
        {
          cmd: 'python3 scripts/publish_sync.py --text "BTC 回踩后继续上攻" --platforms square,twitter',
          desc: "最常用的标准发布命令",
        },
        {
          cmd: "python3 scripts/publish_sync.py --doctor",
          desc: "发布前的环境自检",
        },
      ],
    },
    cta: {
      title: "让你的内容发布流程，像命令一样稳定",
      subtitle: "影响力一键同步到 X、币安广场 与更多平台",
      primaryCta: "查看使用方式",
      secondaryCta: "浏览命令示例",
    },
  },
  workflow: {
    hero: {
      title: "4 步完成一次同步发布",
      subtitle: "从配置初始化到正式发布，整个流程保持简单、明确、可验证。",
    },
    steps: [
      {
        id: "01",
        title: "初始化本地配置",
        description:
          "运行初始化命令，生成本地 .env 模板，为后续平台接入做好准备。",
        detail: "python3 scripts/publish_sync.py --init-config",
      },
      {
        id: "02",
        title: "填写平台凭证",
        description:
          "配置 Binance Square、X、Telegram、Threads 所需凭证，默认以 Square 与 X 为核心发布组合。",
        detail: "在 .env 文件中填入 API Key 与 Secret",
      },
      {
        id: "03",
        title: "运行 doctor 自检",
        description: "在发布前检查缺失项与环境问题，降低实际发布时的失败率。",
        detail: "python3 scripts/publish_sync.py --doctor",
      },
      {
        id: "04",
        title: "执行同步发布",
        description: "输入一条内容，指定平台组合，一次命令完成多端分发。",
        detail:
          'python3 scripts/publish_sync.py --text "..." --platforms square,twitter',
      },
    ],
    supporting: {
      defaults: "默认平台：square,twitter",
      mode: "默认 twitter-mode：official",
      alternate_branch: "browser 模式作为会话分支",
      resilience: "部分失败不阻塞整体流程",
    },
  },
  commands: {
    hero: {
      title: "真实命令，而不是概念展示",
      subtitle: "从配置、自检到正式发布，整个工作流都可以直接用命令驱动。",
    },
    tabs: [
      {
        id: "init",
        label: "初始化",
        cmd: "python3 scripts/publish_sync.py --init-config",
        output: [
          "> Creating .env template...",
          "> [SUCCESS] .env created. Please fill in your API keys.",
        ],
      },
      {
        id: "doctor",
        label: "自检",
        cmd: "python3 scripts/publish_sync.py --doctor --platforms square,twitter --twitter-mode official",
        output: [
          "> Checking environment...",
          "> [OK] Python 3.9+",
          "> [OK] Binance Square API Key found",
          "> [OK] Twitter API Key found",
          "> [OK] Network connection",
          "> System ready for publishing.",
        ],
      },
      {
        id: "publish-default",
        label: "默认发布",
        cmd: 'python3 scripts/publish_sync.py --text "BTC 回踩后继续上攻，关注 4h 结构" --platforms square,twitter --twitter-mode official',
        output: [
          "> Publishing to square, twitter...",
          "> [SUCCESS] Square post created",
          "> [SUCCESS] Tweet posted",
          "> Done.",
        ],
      },
      {
        id: "publish-browser",
        label: "浏览器模式",
        cmd: 'python3 scripts/publish_sync.py --text "今日策略更新：严格风控" --platforms square,twitter --twitter-mode browser',
        output: [
          "> Using Twitter Browser Mode...",
          "> [INFO] Browser session active",
          "> [SUCCESS] Tweet posted via browser",
          "> [SUCCESS] Square post created",
        ],
      },
      {
        id: "publish-all",
        label: "全平台",
        cmd: 'python3 scripts/publish_sync.py --text "晚间复盘：BTC 关键位 68k" --platforms square,twitter,tg --twitter-mode official',
        output: [
          "> Publishing to square, twitter, tg...",
          "> [SUCCESS] Square post created",
          "> [SUCCESS] Tweet posted",
          "> [SUCCESS] Telegram message sent",
        ],
      },
    ],
  },
  platforms: {
    hero: {
      title: "支持的平台与发布模式",
      subtitle: "围绕 Binance Square 与 X 构建默认工作流，并提供可扩展的分发路径。",
    },
    grid: [
      {
        name: "Binance Square",
        tag: "default",
        description: "官方 OpenAPI 文本发布，作为核心目标平台之一。",
      },
      {
        name: "X / Twitter Official",
        tag: "default",
        description: "基于官方 API v2 的标准发布路径，适合稳定接入。",
      },
      {
        name: "X / Twitter Browser Mode",
        tag: "alternate",
        description: "基于浏览器会话的分支模式，用于特定场景下的发布需求。",
      },
      {
        name: "Telegram",
        tag: "optional",
        description: "通过 Bot API 推送到频道、群组或聊天。",
      },
      {
        name: "Threads",
        tag: "optional",
        description: "作为可选扩展渠道纳入统一分发流程。",
      },
    ],
    modes: {
      default: "默认推荐路径",
      alternate: "会话分支路径",
      optional: "可选扩展路径",
    },
  },
  faq: {
    hero: {
      title: "常见问题",
      subtitle: "关于 SyncX 的一些解答",
    },
    items: [
      {
        question: "这个工具适合谁？",
        answer:
          "适合长期在 Binance Square 与 X 发布内容的加密创作者、研究员、KOL 和运营团队。",
      },
      {
        question: "默认会发布到哪些平台？",
        answer: "默认以 Binance Square 和 X / Twitter 为核心发布组合。",
      },
      {
        question: "X 支持哪些接入方式？",
        answer: "支持官方 API 模式，也支持浏览器会话模式作为会话分支。",
      },
      {
        question: "可以只发单个平台吗？",
        answer: "可以。平台组合可以按需指定，不必每次都全量分发。",
      },
      {
        question: "发布失败后怎么排查？",
        answer:
          "建议先运行 doctor 自检，再做 dry-run 或单平台测试，逐步定位具体问题。",
      },
      {
        question: "是否会暴露 API key 或 token？",
        answer:
          "不会。设计上应避免回显完整敏感信息，并优先在本地 .env 中管理配置。",
      },
    ],
  },
  shared: {
    nav: {
      logo: "SyncX",
      home: "Home",
      workflow: "Workflow",
      commands: "Commands",
      publisher: "Publisher",
      platforms: "Platforms",
      faq: "FAQ",
      cta: "Get Started",
    },
    footer: {
      copyright: "© 2024 SyncX. All rights reserved.",
    },
    links: {
      docs: "/commands",
      github: "https://github.com/SyncX2026/SyncX",
      x: "https://x.com/SyncX_BSC",
      officialCa: "0x24d931b3165bcbd167d342e0be92e55d6bbaffff",
      officialCaExplorer:
        "https://bscscan.com/address/0x24d931b3165bcbd167d342e0be92e55d6bbaffff",
    },
  },
};
