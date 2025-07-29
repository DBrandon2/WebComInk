import React from 'react';

export default function PullToRefreshIndicator({ pullHeight, triggerPull }) {
  return (
    <div
      style={{
        height: 64,
        width: "100%",
        overflow: "visible",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        marginTop: 48,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="drop-shadow-lg"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="#18181b"
            stroke={pullHeight >= triggerPull ? "#38d46a" : "#edf060"}
            strokeWidth="4"
            opacity="0.7"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={pullHeight >= triggerPull ? "#38d46a" : "#edf060"}
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={
              2 *
              Math.PI *
              28 *
              Math.max(0, 1 - Math.min(1, pullHeight / triggerPull))
            }
            style={{
              stroke: pullHeight >= triggerPull ? "#38d46a" : "#edf060",
            }}
          />
        </svg>
        <span
          className={`mt-1 text-xs font-semibold drop-shadow ${
            pullHeight >= triggerPull ? "text-green-400" : "text-accent"
          }`}
        >
          {pullHeight >= triggerPull
            ? "Relâcher pour passer au chapitre suivant !"
            : "Tirer pour chapitre suivant…"}
        </span>
      </div>
    </div>
  );
} 