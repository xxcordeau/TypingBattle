interface Props {
  size?: number;
  animate?: boolean;
}

export function DinoSprite({ size = 60, animate = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{
        imageRendering: "pixelated",
        animation: animate ? "walk 0.4s steps(1) infinite" : "none",
      }}
    >
      <rect x="4" y="6" width="8" height="6" fill="#1a1a1a" />
      <rect x="8" y="2" width="6" height="5" fill="#1a1a1a" />
      <rect x="12" y="3" width="1" height="1" fill="#f0ece0" />
      <rect x="13" y="5" width="1" height="1" fill="#1a1a1a" />
      <rect x="2" y="7" width="3" height="2" fill="#1a1a1a" />
      <rect x="1" y="8" width="1" height="1" fill="#1a1a1a" />
      <rect x="6" y="12" width="2" height="3" fill="#1a1a1a" />
      <rect x="9" y="12" width="2" height="3" fill="#1a1a1a" />
      <rect x="10" y="7" width="2" height="1" fill="#1a1a1a" />
    </svg>
  );
}
