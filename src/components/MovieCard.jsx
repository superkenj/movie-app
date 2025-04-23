"use client"

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

const MovieCard = ({
  movie,
  inFavorites,
  inWatchlist,
  isWatched,
  onAddToFavorites,
  onRemoveFromFavorites,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onMarkAsWatched,
  onRemoveFromWatched,
  onClick,
  isLoggedIn,
}) => {
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
      <div className="cursor-pointer" onClick={onClick}>
        <img src={posterUrl || "/placeholder.svg"} alt={movie.Title} className="w-full h-64 object-cover" />
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-bold mb-1">{movie.Title}</h3>
          <p className="text-gray-600 mb-2">{movie.Year}</p>
          {movie.voteAverage && (
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-gray-700">{movie.voteAverage}</span>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-4">{movie.Type}</p>

          {/* Status indicators - only show if logged in */}
          {isLoggedIn && (
            <div className="flex flex-wrap gap-1 mb-2">
              {inFavorites && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Heart className="w-3 h-3 mr-1" /> Favorite
                </span>
              )}
              {inWatchlist && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <BookmarkPlus className="w-3 h-3 mr-1" /> Watchlist
                </span>
              )}
              {isWatched && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Eye className="w-3 h-3 mr-1" /> Watched
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-auto p-4 pt-0 grid grid-cols-3 gap-2">
        {isLoggedIn ? (
          <>
            {inFavorites ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFromFavorites()
                }}
                className="flex items-center justify-center p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                title="Remove from favorites"
              >
                <HeartOff className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToFavorites()
                }}
                className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 transition"
                title="Add to favorites"
              >
                <Heart className="w-4 h-4" />
              </button>
            )}

            {inWatchlist ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFromWatchlist()
                }}
                className="flex items-center justify-center p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                title="Remove from watchlist"
              >
                <BookmarkCheck className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToWatchlist()
                }}
                className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition"
                title="Add to watchlist"
              >
                <BookmarkPlus className="w-4 h-4" />
              </button>
            )}

            {isWatched ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFromWatched()
                }}
                className="flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                title="Remove from watched"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsWatched()
                }}
                className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-green-100 hover:text-green-700 transition"
                title="Mark as watched"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          // If not logged in, show login button for all actions
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToFavorites()
              }}
              className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition col-span-3"
              title="Sign in to use these features"
            >
              <LogIn className="w-4 h-4 mr-1" />
              <span>Sign in to track movies</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default MovieCard
