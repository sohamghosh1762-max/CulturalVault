import { Star } from "lucide-react";
import { cn } from "@/utils";

interface RatingStarsProps {
  rating: number;
  className?: string;
  size?: number;
}

export function RatingStars({ rating, className, size = 14 }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled ? "text-amber-500 fill-amber-500" : half ? "text-amber-500 fill-amber-200" : "text-muted-foreground"
            )}
          />
        );
      })}
    </div>
  );
}
