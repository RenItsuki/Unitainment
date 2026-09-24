"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number; // 0 to 10
  onChange?: (val: number) => void;
  readOnly?: boolean;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({
  value,
  onChange,
  readOnly = false,
  max = 10,
  size = "md",
}: RatingStarsProps) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const starSize = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const currentDisplay = hoverVal !== null ? hoverVal : value;

  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: max }).map((_, idx) => {
        const starNum = idx + 1;
        const isFilled = starNum <= currentDisplay;

        return (
          <button
            key={starNum}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(starNum)}
            onMouseEnter={() => !readOnly && setHoverVal(starNum)}
            onMouseLeave={() => !readOnly && setHoverVal(null)}
            className={`p-0.5 transition-transform ${readOnly ? "cursor-default" : "hover:scale-125 cursor-pointer"}`}
            title={`${starNum}/${max}`}
          >
            <Star
              className={`${starSize} transition-colors ${
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-600 hover:text-amber-300"
              }`}
            />
          </button>
        );
      })}
      <span className="ml-2 font-bold text-xs text-amber-400">
        {currentDisplay > 0 ? `${currentDisplay}/${max}` : "Unrated"}
      </span>
    </div>
  );
}
