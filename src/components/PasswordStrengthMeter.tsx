import React from "react";

export default function PasswordStrengthMeter({ score }: { score: number }) {
  const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  const idx = Math.min(Math.max(score, 0), colors.length - 1);
  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded">
        <div className={`h-2 rounded ${colors[idx]}`} style={{ width: `${(score + 1) * 20}%` }} />
      </div>
    </div>
  );
}
