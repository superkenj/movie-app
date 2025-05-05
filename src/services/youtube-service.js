// Function to search for movie trailers using the YouTube API
export async function searchMovieTrailer(movieTitle, movieYear) {
  // Hardcoded API key for development
  // In production, this should be replaced with an environment variable
  const apiKey = "<<your-youtube-api-key>>" // Replace with your YouTube API key

  try {
    const searchQuery = `${movieTitle} ${movieYear} official trailer`
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&key=${apiKey}&type=video`

    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error("YouTube API error:", data.error.message)
      return null
    }

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId
      return videoId
    }

    return null
  } catch (error) {
    console.error("Error searching for trailer:", error)
    return null
  }
}

// Function to get a YouTube embed URL from a video ID
export function getYouTubeEmbedUrl(videoId) {
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=https://plyr.io&iv_load_policy=3&modestbranding=1&rel=0`
}

// Cache for storing trailer video IDs to reduce API calls
const trailerCache = new Map()

// Function to get a trailer with caching
export async function getTrailerWithCache(movieTitle, movieYear) {
  const cacheKey = `${movieTitle}-${movieYear}`

  // Check if we have this trailer in the cache
  if (trailerCache.has(cacheKey)) {
    return trailerCache.get(cacheKey)
  }

  // If not in cache, fetch it
  const videoId = await searchMovieTrailer(movieTitle, movieYear)

  // Store in cache if found
  if (videoId) {
    trailerCache.set(cacheKey, videoId)
  }

  return videoId
}

// Function to search with fallbacks
export async function searchWithFallbacks(title, year) {
  // Try primary search
  let videoId = await searchMovieTrailer(title, year)

  if (!videoId) {
    // Try without year
    videoId = await searchMovieTrailer(title, "trailer")
  }

  if (!videoId) {
    // Try with "movie trailer"
    videoId = await searchMovieTrailer(title, "movie trailer")
  }

  return videoId
}
