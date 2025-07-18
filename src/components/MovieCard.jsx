import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

export const MovieCard = ({ movie, onSelectMovie }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = (x - centerX) / 20;
      const rotateX = (centerY - y) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0,0,0,0.3)`;
    };

    const handleLeave = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      card.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.1)";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/70 shadow-lg transition-all duration-500 hover:border-purple-500/30 hover:shadow-xl"
      onClick={() => onSelectMovie(movie.imdbID)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "/movie-placeholder.svg"}
          alt={movie.Title}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-4">
          <h3 className="truncate text-xl font-bold text-white">
            {movie.Title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-300">{movie.Year}</span>
            <div className="flex items-center space-x-2">
              <span className="flex items-center rounded-full bg-yellow-500/90 px-2 py-1 text-xs font-bold text-gray-900">
                <Icon name="star" className="mr-1 size-3" />
                {movie.imdbRating || "N/A"}
              </span>
              <span className="rounded-full bg-purple-600/90 px-2 py-1 text-xs font-bold text-white">
                {movie.Type}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="rounded-full bg-white/90 p-2 text-gray-900 shadow-lg transition-colors hover:bg-white">
            <Icon name="search" />
          </button>
        </div>
      </div>
    </div>
  );
};
