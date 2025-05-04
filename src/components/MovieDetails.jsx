"use client"

import { useState } from "react"
import { searchWithFallbacks, getYouTubeEmbedUrl } from "../services/youtube-service"

// Add these custom SVG icon components
const Play = (props) => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const X = (props) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// SVG icon components
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

const HeartOff = (props) => (
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
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35" />
    <path d="M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17" />
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

const BookmarkCheck = (props) => (
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
    <path d="m9 10 2 2 4-4" />
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

const EyeOff = (props) => (
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
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

const LogIn = (props) => (
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
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
)

// Loading spinner component
const Spinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

const MovieDetails = ({
  movie,
  onClose,
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
  const [showTrailer, setShowTrailer] = useState(false)
  const [trailerError, setTrailerError] = useState(false)
  const [trailerLoading, setTrailerLoading] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState(null)

  // Function to fetch the trailer when the Play button is clicked
  const handlePlayTrailer = async () => {
    setShowTrailer(true)
    setTrailerLoading(true)
    setTrailerError(false)

    try {
      // Use the fallback search function for better results
      const videoId = await searchWithFallbacks(movie.Title, movie.Year)

      if (videoId) {
        // Get the embed URL for the video
        const embedUrl = getYouTubeEmbedUrl(videoId)
        setTrailerUrl(embedUrl)
        setTrailerError(false)
      } else {
        // No trailer found
        setTrailerError(true)
      }
    } catch (error) {
      console.error("Error fetching trailer:", error)
      setTrailerError(true)
    } finally {
      setTrailerLoading(false)
    }
  }

  const handleCloseTrailer = () => {
    setShowTrailer(false)
    setTrailerUrl(null)
  }

  const handleTrailerError = () => {
    setTrailerError(true)
    setTrailerLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          ✕
        </button>

        {showTrailer ? (
          // When trailer is playing, make it take up the full modal
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {trailerLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Spinner />
                <p className="ml-3 text-gray-700">Loading trailer...</p>
              </div>
            ) : trailerError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-6">
                  <p className="text-lg font-semibold text-gray-700 mb-4">
                    Sorry, we couldn't find a trailer for this movie.
                  </p>
                  <button
                    onClick={handleCloseTrailer}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Back to Movie Details
                  </button>
                </div>
              </div>
            ) : (
              <>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={trailerUrl}
                  title={`${movie.Title} trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={handleTrailerError}
                ></iframe>
                <button
                  onClick={handleCloseTrailer}
                  className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition z-10"
                  aria-label="Close trailer"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Movie Poster */}
            <div className="md:w-1/3 p-4">
              <img
                src={movie.Poster || "/placeholder.svg"}
                alt={movie.Title}
                className="w-full h-auto rounded-lg shadow-md"
              />

              {/* Action buttons */}
              {isLoggedIn ? (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {inFavorites ? (
                    <button
                      onClick={onRemoveFromFavorites}
                      className="flex items-center justify-center p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      title="Remove from favorites"
                    >
                      <HeartOff className="w-4 h-4 mr-1" />
                      <span className="text-sm">Unfavorite</span>
                    </button>
                  ) : (
                    <button
                      onClick={onAddToFavorites}
                      className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 transition"
                      title="Add to favorites"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-sm">Favorite</span>
                    </button>
                  )}

                  {inWatchlist ? (
                    <button
                      onClick={onRemoveFromWatchlist}
                      className="flex items-center justify-center p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      title="Remove from watchlist"
                    >
                      <BookmarkCheck className="w-4 h-4 mr-1" />
                      <span className="text-sm">Remove</span>
                    </button>
                  ) : (
                    <button
                      onClick={onAddToWatchlist}
                      className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition"
                      title="Add to watchlist"
                    >
                      <BookmarkPlus className="w-4 h-4 mr-1" />
                      <span className="text-sm">Watchlist</span>
                    </button>
                  )}

                  {isWatched ? (
                    <button
                      onClick={onRemoveFromWatched}
                      className="flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Remove from watched"
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      <span className="text-sm">Unwatched</span>
                    </button>
                  ) : (
                    <button
                      onClick={onMarkAsWatched}
                      className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-green-100 hover:text-green-700 transition"
                      title="Mark as watched"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm">Watched</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={onAddToFavorites} // This will trigger the login modal
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in to track movies
                </button>
              )}

              {/* Add Play Trailer button */}
              <button
                onClick={handlePlayTrailer}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
              >
                <Play className="w-4 h-4" />
                Play Trailer
              </button>
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3 p-6">
              <h2 className="text-3xl font-bold mb-2">{movie.Title}</h2>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  {movie.Year}
                </span>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  {movie.Runtime}
                </span>
                {movie.imdbRating && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-gray-700">{movie.imdbRating}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Genre</h3>
                <p className="text-gray-700">{movie.Genre}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Plot</h3>
                <p className="text-gray-700">{movie.Plot}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Director</h3>
                <p className="text-gray-700">{movie.Director}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Cast</h3>
                <p className="text-gray-700">{movie.Actors}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetails
