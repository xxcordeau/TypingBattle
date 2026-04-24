export const PIXEL_FONT = "'Press Start 2P', monospace";

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #f0ece0;
    font-family: 'Press Start 2P', monospace;
    image-rendering: pixelated;
  }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f0ece0; }
  ::-webkit-scrollbar-thumb { background: #1a1a1a; }

  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes walk { 0% { transform: translateY(0px); } 50% { transform: translateY(-4px); } 100% { transform: translateY(0px); } }
  @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
  @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(2px); } }
  @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes progressFill { from { width: 0%; } }
  @keyframes floatUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
  @keyframes rankReveal { 0% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }
  @keyframes starSpin { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(1); } }
`;
