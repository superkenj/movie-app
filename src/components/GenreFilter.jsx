"use client"

import { useState } from "react"

const GenreFilter = ({ onGenreSelect, selectedGenre }) => {
  // Common movie genres
  const genres = [
    { id: "all", name: "All Genres" },
    { id: "action", name: "Action" },
    { id: "adventure", name: "Adventure" },
    { id: "animation", name: "Animation" },
    { id: "biography", name: "Biography" },
    { id: "comedy", name: "Comedy" },
    { id: "crime", name: "Crime" },
    { id: "documentary", name: "Documentary" },
    { id: "drama", name: "Drama" },
    { id: "family", name: "Family" },
    { id: "fantasy", name: "Fantasy" },
    { id: "history", name: "History" },
    { id: "horror", name: "Horror" },
    { id: "music", name: "Music" },
    { id: "mystery", name: "Mystery" },
    { id: "romance", name: "Romance" },
    { id: "sci-fi", name: "Sci-Fi" },
    { id: "sport", name: "Sport" },
    { id: "thriller", name: "Thriller" },
    { id: "war", name: "War" },
    { id: "western", name: "Western" },
  ]

  const [isOpen, setIsOpen] = useState(false)

  const handleGenreSelect = (genre) => {
    if (genre === selectedGenre) {
      setIsOpen(false)
      return
    }
    onGenreSelect(genre)
    setIsOpen(false)
  }

  // Find the current genre name to display
  const currentGenreName = genres.find((g) => g.id === selectedGenre)?.name || "All Genres"

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>{currentGenreName}</span>
        <svg
          className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                selectedGenre === genre.id ? "bg-blue-100 text-blue-900 font-medium" : "text-gray-900"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default GenreFilter
