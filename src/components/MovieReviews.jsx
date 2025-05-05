"use client"

import { useState } from "react"
import ReviewForm from "./ReviewForm"
import ReviewList from "./ReviewList"

const MovieReviews = ({ movie, userId, isLoggedIn }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReviewSubmitted = () => {
    // Refresh the review list
    setRefreshKey((prev) => prev + 1)
    // Hide the form after submission
    setShowReviewForm(false)
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ratings & Reviews</h2>

        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Write a Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <ReviewForm movieId={movie.imdbID} userId={userId} onReviewSubmitted={handleReviewSubmitted} />
      )}

      <ReviewList key={refreshKey} movieId={movie.imdbID} userId={userId} />
    </div>
  )
}

export default MovieReviews
