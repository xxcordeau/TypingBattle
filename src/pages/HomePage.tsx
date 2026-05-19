import { useState } from "react";
import type { TextType } from "@/types";
import { PIXEL_FONT } from "@/styles/globalStyles";
import { useGameStore } from "@/store/useGameStore";
import { PixelBox } from "@/components/common/PixelBox";
import { DinoSprite } from "@/components/sprites/DinoSprite";
import { CatSprite } from "@/components/sprites/CatSprite";
import { NicknameInput } from "@/components/home/NicknameInput";
import { CreateRoomForm } from "@/components/home/CreateRoomForm";
import { JoinRoomForm } from "@/components/home/JoinRoomForm";

type Tab = "create" | "join";

export function HomePage() {
  const { nickname, setNickname, createRoom, joinRoom, isLoading } = useGameStore();

  const [inviteCode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("code")?.toUpperCase() ?? "";
  });

  const [tab, setTab] = useState<Tab>(inviteCode ? "join" : "create");

  const handleCreate = (textType: TextType, totalRounds: number, customText?: string) => {
    if (!nickname) return;
    createRoom(nickname, textType, totalRounds, customText);
  };

  const handleJoin = (roomCode: string, spectator?: boolean) => {
    if (!nickname || roomCode.length !== 6) return;
    joinRoom(nickname, roomCode, spectator);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0ece0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "rgba(0,0,0,0.04)",
          animation: "scanline 4s linear infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px", animation: "floatUp 0.5s ease both" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <DinoSprite size={56} animate />
            <CatSprite size={44} />
          </div>
          <h1
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "22px",
              color: "#1a1a1a",
              letterSpacing: "2px",
              lineHeight: "1.6",
              textShadow: "3px 3px 0px rgba(0,0,0,0.12)",
            }}
          >
            TYPING
            <br />
            BATTLE
          </h1>
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#888",
              marginTop: "10px",
              animation: "blink 1.2s step-end infinite",
            }}
          >
            ▶ PRESS START
          </div>
        </div>

        <PixelBox
          accent
          style={{
            animation: "floatUp 0.5s 0.1s ease both",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <NicknameInput value={nickname} onChange={setNickname} />

          <div style={{ display: "flex", marginBottom: "16px", border: "3px solid #1a1a1a" }}>
            {(["create", "join"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  fontFamily: PIXEL_FONT,
                  fontSize: "8px",
                  padding: "10px",
                  background: tab === t ? "#1a1a1a" : "#f0ece0",
                  color: tab === t ? "#f0ece0" : "#1a1a1a",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                {t === "create" ? "CREATE" : "JOIN"}
              </button>
            ))}
          </div>

          {tab === "create" ? (
            <CreateRoomForm disabled={!nickname || isLoading} onSubmit={handleCreate} />
          ) : (
            <JoinRoomForm disabled={!nickname || isLoading} onSubmit={handleJoin} initialCode={inviteCode} />
          )}
        </PixelBox>

        <PixelBox
          style={{
            marginTop: "24px",
            animation: "floatUp 0.5s 0.2s ease both",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: "8px",
              color: "#1a1a1a",
              letterSpacing: "1px",
              marginBottom: "14px",
            }}
          >
            HOW TO PLAY
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontFamily: PIXEL_FONT,
              fontSize: "10px",
              lineHeight: "1.8",
            }}
          >
            {[
              { step: "1", ko: "닉네임을 입력하세요", en: "Enter your nickname" },
              { step: "2", ko: "방을 만들거나 코드로 참가하세요", en: "Create a room or join with a code" },
              { step: "3", ko: "친구에게 방 코드를 공유하세요", en: "Share the room code with friends" },
              { step: "4", ko: "주어진 문장을 가장 빠르게 타이핑하세요", en: "Type the given text as fast as you can" },
              { step: "5", ko: "오타는 백스페이스로 지우고 다시 입력하세요", en: "Use backspace to fix typos and retype" },
              { step: "6", ko: "먼저 끝내는 사람이 승리!", en: "First to finish wins!" },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: "10px" }}>
                <span
                  style={{
                    color: "#f0ece0",
                    background: "#1a1a1a",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </span>
                <div>
                  <div style={{ color: "#1a1a1a" }}>{item.ko}</div>
                  <div style={{ color: "#aaa" }}>{item.en}</div>
                </div>
              </div>
            ))}
          </div>
        </PixelBox>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontFamily: PIXEL_FONT,
            fontSize: "7px",
            color: "#bbb",
          }}
        >
          ──────────────────────
          <br />
          2 ~ 8 PLAYERS · REAL-TIME · NO LOGIN
        </div>
      </div>
    </div>
  );
}
