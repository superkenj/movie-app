"use client"

import { useState } from "react"

// Custom SVG icon components
const Heart = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const BookmarkPlus = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="10" x2="14" y1="10" y2="10" />
  </svg>
)

const Eye = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const MovieCard = ({
  movie,
  onClick,
  inFavorites,
  inWatchlist,
  isWatched,
  onAddToFavorites,
  onRemoveFromFavorites,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onMarkAsWatched,
  onRemoveFromWatched,
  isLoggedIn,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    if (inFavorites) {
      onRemoveFromFavorites()
    } else {
      onAddToFavorites()
    }
  }

  const handleWatchlistClick = (e) => {
    e.stopPropagation()
    if (inWatchlist) {
      onRemoveFromWatchlist()
    } else {
      onAddToWatchlist()
    }
  }

  const handleWatchedClick = (e) => {
    e.stopPropagation()
    if (isWatched) {
      onRemoveFromWatched()
    } else {
      onMarkAsWatched()
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg?height=450&width=300"}
          alt={movie.Title}
          className="w-full h-64 object-cover"
        />
        {isHovered && isLoggedIn && (
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full ${
                inFavorites ? "bg-red-500 text-white" : "bg-white text-gray-700"
              } shadow-md hover:bg-red-600 hover:text-white transition`}
              title={inFavorites ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={handleWatchlistClick}
              className={`p-2 rounded-full ${
                inWatchlist ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              } shadow-md hover:bg-blue-600 hover:text-white transition`}
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>
            <button
              onClick={handleWatchedClick}
              className={`p-2 rounded-full ${
                isWatched ? "bg-green-500 text-white" : "bg-white text-gray-700"
              } shadow-md hover:bg-green-600 hover:text-white transition`}
              title={isWatched ? "Remove from watched" : "Mark as watched"}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">{movie.Title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{movie.Year}</span>
          {movie.voteAverage && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span>{movie.voteAverage}</span>
            </div>
          )}
        </div>

        {/* Display genre if available */}
        {movie.Genre && (
          <div className="mt-2">
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{movie.Genre}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard
