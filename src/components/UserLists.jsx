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

const UserLists = ({ activeView, setActiveView, favoritesCount, watchlistCount, watchedCount, isLoggedIn }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setActiveView("discover")}
        className={`px-4 py-2 rounded-lg transition flex items-center ${
          activeView === "discover" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        Discover
      </button>

      {isLoggedIn ? (
        <>
          <button
            onClick={() => setActiveView("favorites")}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              activeView === "favorites" ? "bg-red-600 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            <Heart className="w-4 h-4 mr-1" />
            Favorites
            {favoritesCount > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeView === "favorites" ? "bg-white text-red-600" : "bg-red-600 text-white"
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("watchlist")}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              activeView === "watchlist" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            <BookmarkPlus className="w-4 h-4 mr-1" />
            Watchlist
            {watchlistCount > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeView === "watchlist" ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                }`}
              >
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("watched")}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              activeView === "watched" ? "bg-green-600 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            <Eye className="w-4 h-4 mr-1" />
            Watched
            {watchedCount > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeView === "watched" ? "bg-white text-green-600" : "bg-green-600 text-white"
                }`}
              >
                {watchedCount}
              </span>
            )}
          </button>
        </>
      ) : (
        <button
          onClick={() => setActiveView("favorites")} // This will trigger login modal
          className="px-4 py-2 rounded-lg transition flex items-center bg-blue-100 text-blue-800 hover:bg-blue-200"
        >
          <LogIn className="w-4 h-4 mr-1" />
          Sign in to view your lists
        </button>
      )}
    </div>
  )
}

export default UserLists
