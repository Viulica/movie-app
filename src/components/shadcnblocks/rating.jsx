"use client";;
import { Star, StarHalf } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_STARS = 5;

const Rating = ({
  rate,
  className
}) => {
  if (!rate) return;

  const renderStars = () => {
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star
        key={`rating-star-full-${i}`}
        className="fill-foreground stroke-foreground" />);
    }

    if (hasHalfStar) {
      stars.push(<div key="rating-half-star" className="relative">
        <StarHalf className="absolute top-0 right-0 fill-foreground stroke-foreground" />
        <StarHalf
          className="absolute top-0 left-0 -scale-x-100 fill-foreground/15 stroke-foreground/15" />
      </div>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star
        key={`rating-star-empty-${i}`}
        className="fill-foreground/15 stroke-foreground/15" />);
    }

    return stars;
  };

  return (
    <div
      className={cn("flex items-center gap-1 [&_svg]:size-5 [&>div]:size-5", className)}>
      {renderStars()}
    </div>
  );
};

export { Rating };
