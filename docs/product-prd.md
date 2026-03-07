# PRD - SyncX｜加密信息一站式同步器

## 1. 产品定位
为 Crypto Twitter / Binance Square 创作者提供“一次输入，多平台同步发布”的自动化技能。

## 2. 目标用户
- 币圈 KOL / 研究员 / 项目方运营
- 已经在 X（Twitter）与币安广场持续发内容的人
- 希望减少重复搬运操作的人

## 3. 核心问题
当前创作者需要分别打开多个平台重复发文，耗时且容易遗漏。

## 4. MVP 目标
1. 支持同一条文本一键同步到：
- Binance Square
- X (Twitter)
2. 提供可选扩展：
- Telegram 频道/群组
- Threads
3. 具备可执行的本地闭环：
- 配置模板
- 配置自检（doctor）
- 一键发布脚本
- 排障与 FAQ 文档

## 5. 非目标（MVP）
- 不做图文/视频编辑器
- 不做复杂定时编排系统
- 不做团队权限后台

## 6. 关键能力
1. 多平台统一发布命令
2. 平台级独立失败隔离（部分失败不影响其他平台）
3. 双模式 X 发布：
- 官方 API 模式（推荐）
- 浏览器会话模式（备选）
4. 统一 JSON 结果返回（URL/ID/错误）

## 7. 用户流程
1. 初始化 `.env` 模板
2. 填写平台密钥
3. `doctor` 自检
4. 执行发布命令
5. 查看每个平台返回结果

## 8. 技术方案
- 语言：Python 3（标准库）
- 入口：`scripts/publish_sync.py`
- 默认目标：`square,twitter`
- 并发策略：平台级并发发布
- 可测性：`scripts/smoke_test.py` 本地 mock 端到端验证

## 9. 安全策略
1. 不在输出中回显完整密钥
2. 本地 `.env` 存储，避免明文外传
3. 用户泄露后可快速轮换 API key/token

## 10. 成功标准（验收）
1. 能在本地执行以下命令并返回结构化 JSON：
```bash
python scripts/publish_sync.py --text "test" --platforms square,twitter
```
2. `doctor` 能准确识别缺失配置
3. `smoke_test.py` 可通过
4. 文档覆盖以下问题：
- Binance Square API 获取与错误码
- X 官方 API 配置
- X 浏览器 token/cookie 配置
- Telegram 机器人和频道发送准备
- Threads 接入准备

## 11. 命名
- 英文名：SyncX
- 中文名：加密信息一站式同步器
- 技能 ID：`syncx`
