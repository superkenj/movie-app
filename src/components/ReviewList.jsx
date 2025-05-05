"use client"

import { useState, useEffect } from "react"

// Custom icon components
const ThumbsUp = (props) => (
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
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
)

const ThumbsDown = (props) => (
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
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
)

const MessageSquare = (props) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

// Custom function to format date to relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  // Convert to appropriate time unit
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`
}

const ReviewList = ({ movieId, userId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userVotes, setUserVotes] = useState({})

  useEffect(() => {
    fetchReviews()
  }, [movieId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        "https://igyzofuvkuczbscikiay.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneXpvZnV2a3VjemJzY2lraWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjgzNTgsImV4cCI6MjA2MDgwNDM1OH0.T_NxTZO8adZQXZW3-5z5tbLcDgNPLjv_eJK_YRPxyYg",
      )

      // Fetch reviews for this movie
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("movie_id", movieId)
        .order("created_at", { ascending: false })

      if (reviewsError) {
        // If the table doesn't exist yet, just show empty state
        if (reviewsError.code === "42P01") {
          setReviews([])
          return
        }
        throw reviewsError
      }

      // If user is logged in, fetch their votes
      if (userId && reviewsData && reviewsData.length > 0) {
        const { data: votesData, error: votesError } = await supabase
          .from("review_votes")
          .select("*")
          .eq("user_id", userId)
          .in(
            "review_id",
            reviewsData.map((review) => review.id),
          )

        if (votesError && votesError.code !== "42P01") throw votesError

        if (votesData) {
          // Create a map of review_id -> vote_type
          const userVotesMap = {}
          votesData.forEach((vote) => {
            userVotesMap[vote.review_id] = vote.vote_type
          })

          setUserVotes(userVotesMap)
        }
      }

      setReviews(reviewsData || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setError("Failed to load reviews. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (reviewId, voteType) => {
    if (!userId) {
      alert("Please sign in to vote on reviews")
      return
    }

    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        "https://igyzofuvkuczbscikiay.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneXpvZnV2a3VjemJzY2lraWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjgzNTgsImV4cCI6MjA2MDgwNDM1OH0.T_NxTZO8adZQXZW3-5z5tbLcDgNPLjv_eJK_YRPxyYg",
      )

      const currentVote = userVotes[reviewId]

      // If user already voted the same way, remove their vote
      if (currentVote === voteType) {
        // Delete the vote
        const { error: deleteError } = await supabase
          .from("review_votes")
          .delete()
          .eq("user_id", userId)
          .eq("review_id", reviewId)

        if (deleteError) throw deleteError

        // Update the review count
        const { error: updateError } = await supabase
          .from("reviews")
          .update({
            [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc("decrement", { x: 1 }),
          })
          .eq("id", reviewId)

        if (updateError) throw updateError

        // Update local state
        setUserVotes((prev) => {
          const newVotes = { ...prev }
          delete newVotes[reviewId]
          return newVotes
        })

        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  [voteType === "upvote" ? "upvotes" : "downvotes"]:
                    review[voteType === "upvote" ? "upvotes" : "downvotes"] - 1,
                }
              : review,
          ),
        )
      }
      // If user is changing their vote
      else if (currentVote) {
        // Update the vote
        const { error: updateVoteError } = await supabase
          .from("review_votes")
          .update({ vote_type: voteType })
          .eq("user_id", userId)
          .eq("review_id", reviewId)

        if (updateVoteError) throw updateVoteError

        // Update the review counts
        const { error: updateReviewError } = await supabase
          .from("reviews")
          .update({
            [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc("increment", { x: 1 }),
            [voteType === "upvote" ? "downvotes" : "upvotes"]: supabase.rpc("decrement", { x: 1 }),
          })
          .eq("id", reviewId)

        if (updateReviewError) throw updateReviewError

        // Update local state
        setUserVotes((prev) => ({
          ...prev,
          [reviewId]: voteType,
        }))

        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  [voteType === "upvote" ? "upvotes" : "downvotes"]:
                    review[voteType === "upvote" ? "upvotes" : "downvotes"] + 1,
                  [voteType === "upvote" ? "downvotes" : "upvotes"]:
                    review[voteType === "upvote" ? "downvotes" : "upvotes"] - 1,
                }
              : review,
          ),
        )
      }
      // If user is voting for the first time
      else {
        // Insert the vote
        const { error: insertError } = await supabase.from("review_votes").insert([
          {
            user_id: userId,
            review_id: reviewId,
            vote_type: voteType,
          },
        ])

        if (insertError) throw insertError

        // Update the review count
        const { error: updateError } = await supabase
          .from("reviews")
          .update({
            [voteType === "upvote" ? "upvotes" : "downvotes"]: supabase.rpc("increment", { x: 1 }),
          })
          .eq("id", reviewId)

        if (updateError) throw updateError

        // Update local state
        setUserVotes((prev) => ({
          ...prev,
          [reviewId]: voteType,
        }))

        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  [voteType === "upvote" ? "upvotes" : "downvotes"]:
                    review[voteType === "upvote" ? "upvotes" : "downvotes"] + 1,
                }
              : review,
          ),
        )
      }
    } catch (error) {
      console.error("Error voting on review:", error)
      alert("Failed to register your vote. Please try again.")
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center my-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">No reviews yet. Be the first to review this movie!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h3>

      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">{review.name}</div>
              <div className="text-sm text-gray-500">{formatRelativeTime(review.created_at)}</div>
            </div>
            <div>{renderStars(review.rating)}</div>
          </div>

          <p className="text-gray-700 mb-4">{review.review_text}</p>

          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => handleVote(review.id, "upvote")}
              className={`flex items-center space-x-1 ${
                userVotes[review.id] === "upvote" ? "text-green-600" : "text-gray-500 hover:text-green-600"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{review.upvotes || 0}</span>
            </button>

            <button
              onClick={() => handleVote(review.id, "downvote")}
              className={`flex items-center space-x-1 ${
                userVotes[review.id] === "downvote" ? "text-red-600" : "text-gray-500 hover:text-red-600"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{review.downvotes || 0}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
