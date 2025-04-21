"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import SearchBar from "./components/SearchBar"
import MovieCard from "./components/MovieCard"

// Create the Supabase client outside of the component
const supabase = createClient(
  "https://igyzofuvkuczbscikiay.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneXpvZnV2a3VjemJzY2lraWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjgzNTgsImV4cCI6MjA2MDgwNDM1OH0.T_NxTZO8adZQXZW3-5z5tbLcDgNPLjv_eJK_YRPxyYg",
)

function App() {
  const [session, setSession] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)

      // Set up auth state change listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }

    checkSession()
  }, []) // Remove the dependency array

  const searchMovies = async (query) => {
    const API_KEY = "5b064a07"
    try {
      setLoading(true)
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
      const data = await response.json()
      setMovies(data.Search || [])
    } catch (error) {
      console.error("Error fetching movies:", error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const saveToFavorites = async (movie) => {
    if (!session) return

    try {
      const { error } = await supabase.from("favorites").insert([
        {
          movie_id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
          type: movie.Type,
          user_id: session.user.id,
        },
      ])

      if (error) {
        console.error("Error saving favorite:", error)
        alert(`Error: ${error.message}`)
      } else {
        alert(`${movie.Title} added to favorites!`)
      }
    } catch (error) {
      console.error("Error saving favorite:", error)
      alert("An error occurred while saving to favorites")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Movie Search App</h1>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={["google", "github"]} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Movie Search</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        <SearchBar onSearch={searchMovies} />

        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} onSave={saveToFavorites} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {movies.length === 0 ? "Search for movies to see results" : "No movies found. Try another search."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
