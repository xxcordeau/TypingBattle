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
  const [tab, setTab] = useState<Tab>("create");

  const handleCreate = (textType: TextType, totalRounds: number, customText?: string) => {
    if (!nickname) return;
    createRoom(nickname, textType, totalRounds, customText);
  };

  const handleJoin = (roomCode: string) => {
    if (!nickname || roomCode.length !== 6) return;
    joinRoom(nickname, roomCode);
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
            <JoinRoomForm disabled={!nickname || isLoading} onSubmit={handleJoin} />
          )}
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
