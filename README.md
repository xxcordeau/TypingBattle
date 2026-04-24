
<img width="1634" height="831" alt="image" src="https://github.com/user-attachments/assets/79977cc4-2314-4a7c-a758-c979e656f5e0" />

# ⌨️ Typing Battle

링크 하나로 친구를 불러서, 같은 지문을 동시에 타이핑하며 속도를 겨루는 실시간 멀티플레이 게임.

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Vite**
- **Zustand** (전역 상태)
- **WebSocket / STOMP** (실시간 통신, 현재 mock)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
src/
├── pages/            # 화면별 페이지
│   ├── HomePage.tsx
│   ├── WaitingRoomPage.tsx
│   ├── GamePage.tsx
│   └── ResultPage.tsx
├── components/
│   ├── common/       # PixelBox, PixelButton, PixelInput
│   ├── sprites/      # DinoSprite, CatSprite
│   ├── home/         # NicknameInput, CreateRoomForm, JoinRoomForm
│   ├── waiting/      # PlayerList, RoomCodeShare, StartButton
│   ├── game/         # TypingArea, ProgressBar, OtherPlayersBar, Timer
│   └── result/       # RankCard, ResultTable
├── hooks/
│   ├── useWebSocket.ts   # STOMP 연결 (현재 mock, 추후 @stomp/stompjs)
│   ├── useRoom.ts        # 방 상태 selector
│   ├── useGame.ts        # 상대 플레이어 진행률
│   └── useTyping.ts      # 타이핑 판정 / WPM / 정확도
├── store/
│   └── useGameStore.ts   # zustand 전역 스토어
├── api/
│   └── roomApi.ts        # REST 호출 (현재 mock)
├── types/
│   └── index.ts          # DTO / 공통 타입
├── constants/
│   ├── texts.ts          # 한/영 예문 (퍼블릭 도메인)
│   └── mockData.ts
└── styles/
    └── globalStyles.ts
```

## 🔌 백엔드 연동 포인트

- `src/api/roomApi.ts` — REST 호출 (현재 mock 응답)
- `src/hooks/useWebSocket.ts` — STOMP 구독/발행 (현재 no-op)
  - Topic: `/topic/room/{roomId}`, `/topic/game/{roomId}`, `/topic/result/{roomId}`
  - App dest: `/app/room/{roomId}/start`, `/app/game/{roomId}/progress`, `/app/game/{roomId}/finish`

실제 연동 시 `VITE_API_BASE_URL` / `VITE_WS_URL` 환경변수를 사용하세요.
