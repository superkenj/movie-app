"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import SearchBar from "./components/SearchBar"
import MovieCard from "./components/MovieCard"
import MovieDetails from "./components/MovieDetails"
import CategorySelector from "./components/CategorySelector"
import UserLists from "./components/UserLists"
// Import GenreFilter at the top with other imports
import GenreFilter from "./components/GenreFilter"
import { initializeSupabase } from "./services/supabase-service"

// Create the Supabase client outside of the component
const supabase = createClient(
  "https://<<supabase-url>>.supabase.co",
  "<<supabase-anon-key>>",
) // Replace with your Supabase URL and Anon Key

// OMDB API key
const OMDB_API_KEY = "<<your-omdb-api-key>>" // Replace with your OMDB API key

function App() {
  const [session, setSession] = useState(null)
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [loginMessage, setLoginMessage] = useState("Sign in to save your movie lists across devices")
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("popular")
  // Add selectedGenre state in the App function component
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [activeView, setActiveView] = useState("discover") // discover, watchlist, watched, favorites
  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [watchedList, setWatchedList] = useState([])
  const [lastAction, setLastAction] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize Supabase tables and functions
    initializeSupabase().catch(console.error)

    // Check for active session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        // Load user data from Supabase
        await loadUserData(session.user.id)
      }

      setLoading(false)

      // Set up auth state change listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        if (session) {
          setShowLogin(false)
          await loadUserData(session.user.id)

          // If there was a pending action before login, execute it now
          if (lastAction) {
            const { action, movie } = lastAction
            executeAction(action, movie)
            setLastAction(null)
          }
        }
      })

      return () => subscription.unsubscribe()
    }

    checkSession()
  }, [])

  // Load movies by category or genre when component mounts or when category/genre changes
  useEffect(() => {
    if (activeView === "discover") {
      if (selectedGenre === "all") {
        fetchMoviesByCategory(selectedCategory)
      } else {
        fetchMoviesByGenre(selectedGenre)
      }
    }
  }, [selectedCategory, selectedGenre, activeView])

  // Remove or comment out this problematic useEffect that's causing the infinite loop:
  // useEffect(() => {
  //   if (selectedGenre) {
  //     const filtered = movies.filter((movie) => {
  //       // If we have detailed movie info with genre
  //       if (movie.Genre) {
  //         return movie.Genre.includes(selectedGenre)
  //       }
  //       // For movies without detailed genre info, we'll need to fetch it
  //       else {
  //         fetchMovieGenre(movie)
  //         // Default to showing the movie until we know its genre
  //         return true
  //       }
  //     })
  //     setFilteredMovies(filtered)
  //   } else {
  //     setFilteredMovies(movies)
  //   }
  // }, [movies, selectedGenre])

  // Load user lists when activeView changes
  useEffect(() => {
    if (!session) {
      // If user is not logged in and tries to view a list, prompt for login
      if (activeView !== "discover") {
        setLoginMessage("Sign in to view your movie lists")
        setShowLogin(true)
        setActiveView("discover")
      }
      return
    }

    if (activeView === "watchlist") {
      const moviesToShow = selectedGenre
        ? watchlist.filter((movie) => movie.Genre && movie.Genre.includes(selectedGenre))
        : watchlist
      setFilteredMovies(moviesToShow)
      setMovies(watchlist)
    } else if (activeView === "watched") {
      const moviesToShow = selectedGenre
        ? watchedList.filter((movie) => movie.Genre && movie.Genre.includes(selectedGenre))
        : watchedList
      setFilteredMovies(moviesToShow)
      setMovies(watchedList)
    } else if (activeView === "favorites") {
      const moviesToShow = selectedGenre
        ? favorites.filter((movie) => movie.Genre && movie.Genre.includes(selectedGenre))
        : favorites
      setFilteredMovies(moviesToShow)
      setMovies(favorites)
    }
  }, [activeView, watchlist, watchedList, favorites, session, selectedGenre])

  const fetchMovieGenre = async (movie) => {
    // Skip if we already have the genre or if it's already being fetched
    if (movie.Genre || movie.fetchingGenre) return

    try {
      // Mark as being fetched to avoid duplicate requests
      movie.fetchingGenre = true

      const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`)
      const data = await response.json()

      if (data.Response === "True" && data.Genre) {
        // Update the movie with genre info
        const updatedMovies = movies.map((m) => (m.imdbID === movie.imdbID ? { ...m, Genre: data.Genre } : m))
        setMovies(updatedMovies)

        // Also update the appropriate list
        if (activeView === "favorites") {
          const updatedFavorites = favorites.map((m) => (m.imdbID === movie.imdbID ? { ...m, Genre: data.Genre } : m))
          setFavorites(updatedFavorites)
        } else if (activeView === "watchlist") {
          const updatedWatchlist = watchlist.map((m) => (m.imdbID === movie.imdbID ? { ...m, Genre: data.Genre } : m))
          setWatchlist(updatedWatchlist)
        } else if (activeView === "watched") {
          const updatedWatched = watchedList.map((m) => (m.imdbID === movie.imdbID ? { ...m, Genre: data.Genre } : m))
          setWatchedList(updatedWatched)
        }

        // Re-apply genre filter
        if (selectedGenre) {
          const filtered = movies
            .map((m) => (m.imdbID === movie.imdbID ? { ...m, Genre: data.Genre } : m))
            .filter((m) => m.Genre && m.Genre.includes(selectedGenre))
          setFilteredMovies(filtered)
        }
      }
    } catch (error) {
      console.error("Error fetching movie genre:", error)
    } finally {
      movie.fetchingGenre = false
    }
  }

  const loadUserData = async (userId) => {
    try {
      setLoading(true)

      // Load favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)

      if (favoritesError) throw favoritesError

      // Load watchlist
      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId)

      if (watchlistError) throw watchlistError

      // Load watched
      const { data: watchedData, error: watchedError } = await supabase
        .from("watched")
        .select("*")
        .eq("user_id", userId)

      if (watchedError) throw watchedError

      // Transform data to match movie format
      const transformedFavorites = favoritesData.map((item) => ({
        imdbID: item.movie_id,
        Title: item.title,
        Year: item.year,
        Poster: item.poster,
        Type: item.type,
        voteAverage: item.rating,
        Genre: item.genre || null,
      }))

      const transformedWatchlist = watchlistData.map((item) => ({
        imdbID: item.movie_id,
        Title: item.title,
        Year: item.year,
        Poster: item.poster,
        Type: item.type,
        voteAverage: item.rating,
        Genre: item.genre || null,
      }))

      const transformedWatched = watchedData.map((item) => ({
        imdbID: item.movie_id,
        Title: item.title,
        Year: item.year,
        Poster: item.poster,
        Type: item.type,
        voteAverage: item.rating,
        watchedDate: item.watched_date,
        Genre: item.genre || null,
      }))

      setFavorites(transformedFavorites)
      setWatchlist(transformedWatchlist)
      setWatchedList(transformedWatched)
    } catch (error) {
      console.error("Error loading user data:", error)
      setError("Failed to load your saved movies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const searchMovies = async (query) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`)
      const data = await response.json()

      if (data.Response === "False") {
        setError(data.Error || "No movies found")
        setMovies([])
        setFilteredMovies([])
      } else {
        setMovies(data.Search || [])
        setFilteredMovies(data.Search || [])
      }
      setActiveView("discover")
      setSelectedGenre(null) // Reset genre filter on new search
    } catch (error) {
      console.error("Error fetching movies:", error)
      setError("Failed to search movies. Please try again later.")
      setMovies([])
      setFilteredMovies([])
    } finally {
      setLoading(false)
    }
  }

  // Add a new function to fetch movies by genre
  const fetchMoviesByGenre = async (genre) => {
    try {
      setLoading(true)
      setError(null)

      // If "all" is selected, use the category-based search
      if (genre === "all") {
        fetchMoviesByCategory(selectedCategory)
        return
      }

      // For specific genres, search for that genre
      const searchTerm = genre
      const url = `https://www.omdbapi.com/?s=${searchTerm}&type=movie&apikey=${OMDB_API_KEY}`

      console.log(`Fetching ${genre} movies from OMDB:`, url)

      const response = await fetch(url)
      const data = await response.json()

      if (data.Response === "False") {
        console.error("OMDB API error:", data.Error)
        setError(data.Error || `No movies found for ${genre}`)
        setMovies([])
        setFilteredMovies([])
      } else {
        console.log(`Fetched ${genre} movies:`, data)

        // Add a fake rating to each movie since OMDB search doesn't include ratings
        const moviesWithRatings = data.Search.map((movie) => ({
          ...movie,
          voteAverage: (Math.random() * 2 + 7).toFixed(1), // Random rating between 7.0 and 9.0
          Genre: genre.charAt(0).toUpperCase() + genre.slice(1), // Capitalize the genre
        })).slice(0, 10) // Limit to top 10

        setMovies(moviesWithRatings || [])
        setFilteredMovies(moviesWithRatings || [])
      }
    } catch (error) {
      console.error(`Error fetching ${genre} movies:`, error)
      setError("Failed to load movies. Please try again later.")
      setMovies([])
      setFilteredMovies([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMoviesByCategory = async (category) => {
    try {
      setLoading(true)
      setError(null)

      // Since OMDB doesn't have category endpoints like TMDB,
      // we'll simulate categories by searching for specific terms
      let searchTerm = ""
      let searchYear = ""

      switch (category) {
        case "popular":
          // For "popular", we'll search for recent blockbusters
          searchTerm = "movie"
          searchYear = new Date().getFullYear().toString()
          break
        case "now_playing":
          // For "now playing", we'll search for very recent movies
          searchTerm = "2023"
          break
        case "top_rated":
          // For "top rated", we'll search for classic highly-rated films
          searchTerm = "classic"
          break
        default:
          searchTerm = "movie"
      }

      const url = `https://www.omdbapi.com/?s=${searchTerm}${searchYear ? `&y=${searchYear}` : ""}&type=movie&apikey=${OMDB_API_KEY}`
      console.log("Fetching from OMDB:", url)

      const response = await fetch(url)
      const data = await response.json()

      if (data.Response === "False") {
        console.error("OMDB API error:", data.Error)
        setError(data.Error || `No movies found for ${category}`)
        setMovies([])
        setFilteredMovies([])
      } else {
        console.log(`Fetched ${category} movies:`, data)

        // Add a fake rating to each movie since OMDB search doesn't include ratings
        const moviesWithRatings = data.Search.map((movie) => ({
          ...movie,
          voteAverage: (Math.random() * 2 + 7).toFixed(1), // Random rating between 7.0 and 9.0
        }))

        setMovies(moviesWithRatings || [])
        setFilteredMovies(moviesWithRatings || [])
      }
    } catch (error) {
      console.error("Error fetching movies by category:", error)
      setError("Failed to load movies. Please try again later.")
      setMovies([])
      setFilteredMovies([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMovieDetails = async (movieId) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${OMDB_API_KEY}`)

      if (!response.ok) {
        throw new Error(`OMDB API error: ${response.status}`)
      }

      const movieDetails = await response.json()

      if (movieDetails.Response === "False") {
        throw new Error(movieDetails.Error || "Failed to load movie details")
      }

      // Add voteAverage for consistency with our app's format
      movieDetails.voteAverage = movieDetails.imdbRating

      // Add user_id if logged in
      if (session) {
        movieDetails.user_id = session.user.id
      }

      // Update the movie in our lists with the genre information
      if (movieDetails.Genre) {
        // Update in the main movies list
        setMovies((prevMovies) =>
          prevMovies.map((m) => (m.imdbID === movieId ? { ...m, Genre: movieDetails.Genre } : m)),
        )

        // Update in the appropriate list based on active view
        if (activeView === "favorites") {
          setFavorites((prevList) =>
            prevList.map((m) => (m.imdbID === movieId ? { ...m, Genre: movieDetails.Genre } : m)),
          )
        } else if (activeView === "watchlist") {
          setWatchlist((prevList) =>
            prevList.map((m) => (m.imdbID === movieId ? { ...m, Genre: movieDetails.Genre } : m)),
          )
        } else if (activeView === "watched") {
          setWatchedList((prevList) =>
            prevList.map((m) => (m.imdbID === movieId ? { ...m, Genre: movieDetails.Genre } : m)),
          )
        }
      }

      setSelectedMovie(movieDetails)
    } catch (error) {
      console.error("Error fetching movie details:", error)
      setError("Failed to load movie details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Function to handle authentication requirement
  const requireAuth = (action, movie, message) => {
    if (!session) {
      setLoginMessage(message)
      setLastAction({ action, movie })
      setShowLogin(true)
      return false
    }
    return true
  }

  // Execute action after authentication
  const executeAction = (action, movie) => {
    switch (action) {
      case "addToFavorites":
        addToFavorites(movie)
        break
      case "removeFromFavorites":
        removeFromFavorites(movie)
        break
      case "addToWatchlist":
        addToWatchlist(movie)
        break
      case "removeFromWatchlist":
        removeFromWatchlist(movie)
        break
      case "markAsWatched":
        markAsWatched(movie)
        break
      case "removeFromWatched":
        removeFromWatched(movie)
        break
      default:
        break
    }
  }

  const saveToFavorites = (movie) => {
    if (!requireAuth("addToFavorites", movie, "Sign in to add movies to your favorites")) {
      return
    }
    addToFavorites(movie)
  }

  const addToFavorites = async (movie) => {
    try {
      // Convert rating to a number or use 0 if not available
      let rating = 0
      if (movie.voteAverage && !isNaN(Number.parseFloat(movie.voteAverage))) {
        rating = Number.parseFloat(movie.voteAverage)
      } else if (movie.imdbRating && !isNaN(Number.parseFloat(movie.imdbRating))) {
        rating = Number.parseFloat(movie.imdbRating)
      }

      const { error } = await supabase.from("favorites").insert([
        {
          movie_id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
          type: movie.Type,
          rating: rating,
          user_id: session.user.id,
          genre: movie.Genre || null,
        },
      ])

      if (error) {
        if (error.code === "23505") {
          // Unique violation
          alert(`${movie.Title} is already in your favorites!`)
        } else {
          console.error("Error saving favorite:", error)
          alert(`Error: ${error.message}`)
        }
      } else {
        alert(`${movie.Title} added to favorites!`)
        // Update local state
        setFavorites([...favorites, movie])
      }
    } catch (error) {
      console.error("Error saving favorite:", error)
      alert("An error occurred while saving to favorites")
    }
  }

  const removeFromFavorites = async (movie) => {
    if (!requireAuth("removeFromFavorites", movie, "Sign in to manage your favorites")) {
      return
    }

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movie.imdbID)

      if (error) {
        console.error("Error removing favorite:", error)
        alert(`Error: ${error.message}`)
      } else {
        alert(`${movie.Title} removed from favorites!`)
        // Update local state
        setFavorites(favorites.filter((m) => m.imdbID !== movie.imdbID))

        // If we're in favorites view, update the movies list too
        if (activeView === "favorites") {
          setMovies(movies.filter((m) => m.imdbID !== movie.imdbID))
          setFilteredMovies(filteredMovies.filter((m) => m.imdbID !== movie.imdbID))
        }
      }
    } catch (error) {
      console.error("Error removing favorite:", error)
      alert("An error occurred while removing from favorites")
    }
  }

  const addToWatchlist = async (movie) => {
    if (!requireAuth("addToWatchlist", movie, "Sign in to add movies to your watchlist")) {
      return
    }

    try {
      // Convert rating to a number or use 0 if not available
      let rating = 0
      if (movie.voteAverage && !isNaN(Number.parseFloat(movie.voteAverage))) {
        rating = Number.parseFloat(movie.voteAverage)
      } else if (movie.imdbRating && !isNaN(Number.parseFloat(movie.imdbRating))) {
        rating = Number.parseFloat(movie.imdbRating)
      }

      const { error } = await supabase.from("watchlist").insert([
        {
          movie_id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
          type: movie.Type,
          rating: rating,
          user_id: session.user.id,
          genre: movie.Genre || null,
        },
      ])

      if (error) {
        if (error.code === "23505") {
          // Unique violation
          alert(`${movie.Title} is already in your watchlist!`)
        } else {
          console.error("Error adding to watchlist:", error)
          alert(`Error: ${error.message}`)
        }
      } else {
        alert(`${movie.Title} added to watchlist!`)
        // Update local state
        setWatchlist([...watchlist, movie])
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      alert("An error occurred while adding to watchlist")
    }
  }

  const removeFromWatchlist = async (movie) => {
    if (!requireAuth("removeFromWatchlist", movie, "Sign in to manage your watchlist")) {
      return
    }

    try {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movie.imdbID)

      if (error) {
        console.error("Error removing from watchlist:", error)
        alert(`Error: ${error.message}`)
      } else {
        alert(`${movie.Title} removed from watchlist!`)
        // Update local state
        setWatchlist(watchlist.filter((m) => m.imdbID !== movie.imdbID))

        // If we're in watchlist view, update the movies list too
        if (activeView === "watchlist") {
          setMovies(movies.filter((m) => m.imdbID !== movie.imdbID))
          setFilteredMovies(filteredMovies.filter((m) => m.imdbID !== movie.imdbID))
        }
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      alert("An error occurred while removing from watchlist")
    }
  }

  const markAsWatched = async (movie) => {
    if (!requireAuth("markAsWatched", movie, "Sign in to mark movies as watched")) {
      return
    }

    // First remove from watchlist if it's there
    const isInWatchlist = watchlist.some((m) => m.imdbID === movie.imdbID)
    if (isInWatchlist) {
      await removeFromWatchlist(movie)
    }

    try {
      // Convert rating to a number or use 0 if not available
      let rating = 0
      if (movie.voteAverage && !isNaN(Number.parseFloat(movie.voteAverage))) {
        rating = Number.parseFloat(movie.voteAverage)
      } else if (movie.imdbRating && !isNaN(Number.parseFloat(movie.imdbRating))) {
        rating = Number.parseFloat(movie.imdbRating)
      }

      const { error } = await supabase.from("watched").insert([
        {
          movie_id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
          type: movie.Type,
          rating: rating,
          watched_date: new Date().toISOString(),
          user_id: session.user.id,
          genre: movie.Genre || null,
        },
      ])

      if (error) {
        if (error.code === "23505") {
          // Unique violation
          alert(`${movie.Title} is already marked as watched!`)
        } else {
          console.error("Error marking as watched:", error)
          alert(`Error: ${error.message}`)
        }
      } else {
        alert(`${movie.Title} marked as watched!`)
        // Update local state
        const movieWithDate = { ...movie, watchedDate: new Date().toISOString() }
        setWatchedList([...watchedList, movieWithDate])
      }
    } catch (error) {
      console.error("Error marking as watched:", error)
      alert("An error occurred while marking as watched")
    }
  }

  const removeFromWatched = async (movie) => {
    if (!requireAuth("removeFromWatched", movie, "Sign in to manage your watched movies")) {
      return
    }

    try {
      const { error } = await supabase
        .from("watched")
        .delete()
        .eq("user_id", session.user.id)
        .eq("movie_id", movie.imdbID)

      if (error) {
        console.error("Error removing from watched:", error)
        alert(`Error: ${error.message}`)
      } else {
        alert(`${movie.Title} removed from watched list!`)
        // Update local state
        setWatchedList(watchedList.filter((m) => m.imdbID !== movie.imdbID))

        // If we're in watched view, update the movies list too
        if (activeView === "watched") {
          setMovies(movies.filter((m) => m.imdbID !== movie.imdbID))
          setFilteredMovies(filteredMovies.filter((m) => m.imdbID !== movie.imdbID))
        }
      }
    } catch (error) {
      console.error("Error removing from watched:", error)
      alert("An error occurred while removing from watched list")
    }
  }

  // Add a handler for genre selection
  const handleGenreSelect = (genre) => {
    if (genre === selectedGenre) return // Don't update if the genre hasn't changed

    setSelectedGenre(genre)

    if (activeView !== "discover") {
      setActiveView("discover")
    }
  }

  // Update the handleCategoryChange function to reset genre
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedGenre("all") // Reset genre filter on category change
    setActiveView("discover")
  }

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
  }

  const handleMovieClick = (movie) => {
    fetchMovieDetails(movie.imdbID)
  }

  const closeMovieDetails = () => {
    setSelectedMovie(null)
  }

  const isInFavorites = (movieId) => {
    return favorites.some((movie) => movie.imdbID === movieId)
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some((movie) => movie.imdbID === movieId)
  }

  const isWatched = (movieId) => {
    return watchedList.some((movie) => movie.imdbID === movieId)
  }

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <img src="/MyReelIcon.png" alt="App Header" className="app-header" />
            <h1 className="text-3xl font-bold text-gray-800">MyReel</h1>
          </div>

          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Signed in as {session.user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setLoginMessage("Sign in to save your movie lists across devices")
                setShowLogin(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Category and Genre Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Category</h2>
            <CategorySelector selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Genre</h2>
            <GenreFilter selectedGenre={selectedGenre} onGenreSelect={handleGenreSelect} />
          </div>
          <div className="w-full md:w-1/3">
            <SearchBar onSearch={searchMovies} />
          </div>
        </div>

        {/* User Lists Navigation */}
        <UserLists
          activeView={activeView}
          setActiveView={(view) => {
            if (!session && view !== "discover") {
              setLoginMessage(`Sign in to view your ${view}`)
              setShowLogin(true)
            } else {
              setActiveView(view)
            }
          }}
          favoritesCount={favorites.length}
          watchlistCount={watchlist.length}
          watchedCount={watchedList.length}
          isLoggedIn={!!session}
        />

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="text-xl">Loading movies...</div>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                inFavorites={isInFavorites(movie.imdbID)}
                inWatchlist={isInWatchlist(movie.imdbID)}
                isWatched={isWatched(movie.imdbID)}
                onAddToFavorites={() => saveToFavorites(movie)}
                onRemoveFromFavorites={() => removeFromFavorites(movie)}
                onAddToWatchlist={() => addToWatchlist(movie)}
                onRemoveFromWatchlist={() => removeFromWatchlist(movie)}
                onMarkAsWatched={() => markAsWatched(movie)}
                onRemoveFromWatched={() => removeFromWatched(movie)}
                onClick={() => handleMovieClick(movie)}
                isLoggedIn={!!session}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeView === "discover"
                ? selectedGenre
                  ? `No ${selectedGenre} movies found. Try another genre or search.`
                  : "No movies found. Try another search or category."
                : selectedGenre
                  ? `Your ${activeView} doesn't have any ${selectedGenre} movies.`
                  : `Your ${activeView} is empty.`}
            </p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
            <p className="mb-4 text-center text-gray-600">{loginMessage}</p>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={["google", "github"]} />
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={closeMovieDetails}
          inFavorites={isInFavorites(selectedMovie.imdbID)}
          inWatchlist={isInWatchlist(selectedMovie.imdbID)}
          isWatched={isWatched(selectedMovie.imdbID)}
          onAddToFavorites={() => saveToFavorites(selectedMovie)}
          onRemoveFromFavorites={() => removeFromFavorites(selectedMovie)}
          onAddToWatchlist={() => addToWatchlist(selectedMovie)}
          onRemoveFromWatchlist={() => removeFromWatchlist(selectedMovie)}
          onMarkAsWatched={() => markAsWatched(selectedMovie)}
          onRemoveFromWatched={() => removeFromWatched(selectedMovie)}
          isLoggedIn={!!session}
        />
      )}
    </div>
  )
}

export default App
