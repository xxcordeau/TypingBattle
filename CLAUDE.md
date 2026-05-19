# TypingBattle

## IMPORTANT: Production Code Location

**이 워크트리가 프로덕션 코드!**

- **Production (여기)**: `C:\Users\User\Desktop\PJ\TypingBattle_jy\.claude\worktrees\naughty-cori-08c274`
- **Mock only**: `C:\Users\User\Desktop\PJ\TypingBattle` (배포하면 안 됨!)

코드 수정 및 배포는 반드시 이 경로에서 할 것.

## Deployment

- **URL**: https://typebattle.co.kr/
- **Infra**: AWS EC2 (Amazon Linux) + Nginx
- **Instance**: `i-06d0b838613c9e3e3` (TypingBattle), IP `15.165.159.68`
- **SSH Key**: `C:\Users\User\.ssh\typing-battle-key.pem`
- **User**: `ec2-user`
- **Web Root**: `/usr/share/nginx/html/`
- **Backend**: Spring Boot (systemd: `typingbattle.service`, jar: `/home/ec2-user/app.jar`)

### Deploy Steps

```powershell
# 1. Build (반드시 워크트리에서!)
Set-Location "C:\Users\User\Desktop\PJ\TypingBattle_jy\.claude\worktrees\naughty-cori-08c274"
npx vite build

# 2. Upload dist CONTENTS to EC2 (dist 폴더 안의 파일들만!)
$keyPath = "C:\Users\User\.ssh\typing-battle-key.pem"
$ec2 = "ec2-user@15.165.159.68"
ssh -i $keyPath $ec2 "rm -rf /home/ec2-user/dist-new"
Set-Location "C:\Users\User\Desktop\PJ\TypingBattle_jy\.claude\worktrees\naughty-cori-08c274\dist"
scp -i $keyPath -r * "${ec2}:/home/ec2-user/dist-new/"

# 3. Replace nginx html and fix permissions
ssh -i $keyPath $ec2 "sudo rm -rf /usr/share/nginx/html/* && sudo cp -r /home/ec2-user/dist-new/* /usr/share/nginx/html/ && sudo chmod -R 755 /usr/share/nginx/html/ && sudo chown -R nginx:nginx /usr/share/nginx/html/"
```

### Notes

- `npm run build` (`tsc -b && vite build`) fails due to tsconfig.node.json missing `composite: true`. Use `npx vite build` directly.
- AWS CLI path: `C:\Program Files\Amazon\AWSCLIV2\aws.exe`

## Tech Stack

- React 18 + TypeScript + Vite + Zustand
- Styled with inline styles + pixel font retro UI
- STOMP WebSocket + Spring Boot backend

## Project Structure

- `src/store/useGameStore.ts` — Zustand global store
- `src/hooks/` — useRoom, useGame, useTyping, useWebSocket
- `src/pages/` — GamePage, WaitingRoomPage, ResultPage
- `src/components/` — game/, waiting/, result/, home/, common/, sprites/
- `src/types/index.ts` — shared TypeScript types
- `server/` — Spring Boot backend
