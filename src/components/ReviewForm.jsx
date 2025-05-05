"use client"

import { useState } from "react"

// Custom Star icon component
const Star = (props) => (
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
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const ReviewForm = ({ movieId, userId, onReviewSubmitted }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [ratingError, setRatingError] = useState("")
  const [reviewTextError, setReviewTextError] = useState("")

  const validateForm = () => {
    let isValid = true

    // Reset errors
    setNameError("")
    setEmailError("")
    setRatingError("")
    setReviewTextError("")

    // Validate name
    if (!name.trim()) {
      setNameError("Name is required")
      isValid = false
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError("Email is required")
      isValid = false
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    }

    // Validate rating
    if (rating === 0) {
      setRatingError("Please select a rating")
      isValid = false
    }

    // Validate review text
    if (!reviewText.trim()) {
      setReviewTextError("Please write a review")
      isValid = false
    } else if (reviewText.length < 10) {
      setReviewTextError("Review must be at least 10 characters")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        "https://igyzofuvkuczbscikiay.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlneXpvZnV2a3VjemJzY2lraWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjgzNTgsImV4cCI6MjA2MDgwNDM1OH0.T_NxTZO8adZQXZW3-5z5tbLcDgNPLjv_eJK_YRPxyYg",
      )

      // Insert the review
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            movie_id: movieId,
            user_id: userId,
            name: name,
            email: email,
            rating: rating,
            review_text: reviewText,
            upvotes: 0,
            downvotes: 0,
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) {
        if (error.code === "23505") {
          setError("You have already reviewed this movie. You can only submit one review per movie.")
        } else if (error.code === "42P01") {
          setError("The review system is not set up yet. Please contact the administrator.")
        } else {
          throw error
        }
      } else {
        // Reset form
        setName("")
        setEmail("")
        setRating(0)
        setReviewText("")

        // Notify parent component
        if (onReviewSubmitted) {
          onReviewSubmitted(data[0])
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 border rounded-md ${nameError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your name"
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded-md ${emailError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your email"
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    (hoverRating || rating) >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
            </span>
          </div>
          {ratingError && <p className="text-red-500 text-xs mt-1">{ratingError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
            Review *
          </label>
          <textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className={`w-full p-2 border rounded-md min-h-[100px] ${reviewTextError ? "border-red-500" : "border-gray-300"}`}
            placeholder="Write your review here..."
          />
          {reviewTextError && <p className="text-red-500 text-xs mt-1">{reviewTextError}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
