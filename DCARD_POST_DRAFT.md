# Dcard 贴文草稿 -- AI Food Passport v0.2.0

> 目标读者：中文社群（Dcard 科技板、软件工程师板、作品集板等）。可直接使用或依个人风格调整。

---

## 主贴文

**我花了幾個禮拜，從零做了一個可以「掃菜單、看過敏原」的 App -- 來試試看！**

平常跟朋友出去吃飯，有朋友對麩質過敏、有人吃素、有人不吃海鮮......每次點餐都要一個一個看菜單上的成分，真的很麻煩。

所以我就想：如果有一個 App，可以先設定自己的飲食偏好（過敏原、飲食禁忌），然後拍一下菜單，它就會自動標出哪些菜含有你在意的成分 -- 這樣是不是很方便？

**於是我就動手做了一個：AI Food Passport 🍽️**

### 它現在可以做什麼？

1. **設定飲食偏好** -- 可以選擇 8 種常見過敏原（麩質、乳製品、堅果、海鮮、花生、大豆、雞蛋、芝麻）和 5 種飲食限制（素食、純素、清真、猶太潔食、無乳糖）
2. **模擬掃描菜單** -- 因為還沒有接上真實的 OCR/AI 服務，所以現在是用模擬資料來示範流程
3. **個人化過敏原警告** -- 每道菜旁邊會顯示一個標籤，例如「含：麩質、乳製品」，讓你一眼看出哪些菜不適合
4. **掃描歷史** -- 可以回看之前掃過的菜單結果
5. **不用安裝** -- 我把它部署成網頁版，直接打開連結就能試用

### 技術方面

- 前端：Flutter（Dart），用 Riverpod 做狀態管理
- 後端：Node.js Express，部署在 Render 上面（免費方案，第一次載入可能要等 30-60 秒喚醒）
- 網頁 Demo：GitHub Pages
- 測試：97/97 個 Flutter 測試全部通過

### 老實說 -- 這個專案的限制

- OCR 和 AI 分析都是**模擬的**，不是真的 AI 在辨識菜單
- **不是正式的產品**，不能拿來做真的過敏安全判斷
- **沒有上架 App Store 或 TestFlight**（這個階段只是作品集專案）
- 掃描歷史是暫存在記憶體裡的，重新整理就會消失

我做這個專案的目的，是想練習**從零到有做一個完整的 App**：UI 設計 → 狀態管理 → 前後端整合 → 部署 → 測試 → 發行文件。比起做出一個「真正的產品」，我更在意的是**把整個流程跑通**，證明自己有能力主導一個完整的軟體專案。

### 來試試看吧！

🔗 **網頁 Demo：** https://allengwong-droid.github.io/ai-food-passport/demo/
📦 **GitHub（含完整原始碼）：** https://github.com/AllengWong-droid/ai-food-passport

歡迎給我任何回饋或建議！如果你也在學 Flutter 或 Node.js，歡迎交流 🙌

#Flutter #Dart #NodeJS #個人作品 #App開發 #開源

---

## 替代版本：簡短版

做了一個可以掃菜單看過敏原的 App（模擬版），Flutter + Node.js，有公開網頁 Demo 可以試玩！

👉 https://allengwong-droid.github.io/ai-food-passport/demo/

不是正式產品，是作品集專案。歡迎試用、給回饋 🙏

---

## 替代版本：技術板

**Flutter + Node.js 全端專案分享：AI Food Passport（開源 + 線上 Demo）**

架構：
- Flutter 3.x + Riverpod + go_router
- Node.js Express 後端（Render 部署）
- Provider 模式：模擬/真實 OCR/AI 分析可互換
- GitHub Pages 部署 Flutter Web
- 97/97 測試通過

GitHub: https://github.com/AllengWong-droid/ai-food-passport
Demo: https://allengwong-droid.github.io/ai-food-passport/demo/

適合想參考 Flutter 全端專案架構的同學。歡迎提 issue 或 PR！

---

## 發文小提醒

- 可以附上幾張 Demo 截圖（飲食偏好設定頁面、掃描結果 + 過敏原警告標籤）
- 如果有人問「這能真的拿來用嗎？」，誠實說明這是模擬 Demo，不是正式產品
- 如果有人問為什麼不上架，說明這是作品集 MVP，還需要真實 OCR/AI 供應商 API key 才能啟用
- 保持輕鬆、真誠的語氣，不要寫得像在推銷產品
