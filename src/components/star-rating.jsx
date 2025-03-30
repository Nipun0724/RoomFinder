import { Star } from "lucide-react"

export function StarRating({ rating, maxRating = 5, size = 20, interactive = false, onRatingChange }) {
  const stars = []

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => interactive && onRatingChange && onRatingChange(i)}
        className={interactive ? "cursor-pointer" : ""}
      >
        <Star size={size} fill={i <= rating ? "#FFD700" : "none"} color={i <= rating ? "#FFD700" : "#D3D3D3"} />
      </span>,
    )
  }

  return <div className="flex">{stars}</div>
}

