"use client";

export default function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="skeleton"
          style={{
            height: 44,
            borderRadius: 10,
            marginBottom: 12,
            background: "#eee",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span style={{ opacity: 0 }}>.</span>
          <style jsx>{`
            .skeleton::after {
              content: "";
              position: absolute;
              inset: 0;
              transform: translateX(-100%);
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.7),
                transparent
              );
              animation: shimmer 1.1s infinite;
            }
            @keyframes shimmer {
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </li>
      ))}
    </ul>
  );
}
