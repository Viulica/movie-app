"use client";
import { Star, StarHalf } from "lucide-react";
import { useState, useRef } from "react";

import { cn } from "@/lib/utils";

const MAX_STARS = 10;

export function Rating({ rate, className, onChange, interactive = true }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const starRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    if (!interactive) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        onChange && onChange(index + 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        const nextIndex = Math.min(index + 1, MAX_STARS - 1);
        setFocusedIndex(nextIndex);
        starRefs.current[nextIndex]?.focus();
        break;
      case "ArrowLeft":
        event.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        setFocusedIndex(prevIndex);
        starRefs.current[prevIndex]?.focus();
        break;
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        starRefs.current[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        setFocusedIndex(MAX_STARS - 1);
        starRefs.current[MAX_STARS - 1]?.focus();
        break;
    }
  };

  const handleStarFocus = (index) => {
    setFocusedIndex(index);
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < MAX_STARS; i++) {
      const starValue = i + 1;
      const isFilled = starValue <= (rate || 0);

      stars.push(
        <Star
          ref={(el) => {
            if (el) starRefs.current[i] = el;
          }}
          key={`rating-star-${i}`}
          className={cn(
            isFilled
              ? "fill-yellow-400 stroke-yellow-400"
              : "fill-foreground/15 stroke-foreground/15",
            interactive &&
              "cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          )}
          onClick={() => {
            if (interactive && onChange) {
              // Toggle: if clicking the same star, remove the rating
              if (rate === starValue) {
                onChange(0);
              } else {
                onChange(starValue);
              }
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={() => handleStarFocus(i)}
          aria-label={
            interactive ? `Ocijeni ${starValue} zvjezdica` : undefined
          }
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? (focusedIndex === i ? 0 : -1) : undefined}
          aria-pressed={interactive ? rate >= starValue : undefined}
        />
      );
    }

    return stars;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 [&_svg]:size-5 [&>div]:size-5",
        className
      )}
      role={interactive ? "group" : undefined}
      aria-label={
        interactive
          ? "Ocjenjivanje filma - koristite tipke sa strelicama za navigaciju, Enter ili Space za odabir"
          : undefined
      }
    >
      {renderStars()}
    </div>
  );
}
