interface Props {
  size?: number;
  color?: string;
  eyeColor?: string;
}

export function CatSprite({
  size = 40,
  color = "#1a1a1a",
  eyeColor = "#f0ece0",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      style={{ imageRendering: "pixelated", animation: "walk 0.3s steps(1) infinite" }}
    >
      <rect x="2" y="3" width="8" height="6" fill={color} />
      <rect x="2" y="1" width="2" height="3" fill={color} />
      <rect x="8" y="1" width="2" height="3" fill={color} />
      <rect x="4" y="4" width="1" height="1" fill={eyeColor} />
      <rect x="7" y="4" width="1" height="1" fill={eyeColor} />
      <rect x="1" y="7" width="2" height="2" fill={color} />
      <rect x="9" y="7" width="2" height="2" fill={color} />
    </svg>
  );
}
