import { createClient } from "@supabase/supabase-js"

// Create the Supabase client
const supabase = createClient(
  "https://<<supabase-url>>.supabase.co",
  "<<supabase-anon-key>>",
)   // Replace with your Supabase URL and Anon Key

// Create the necessary database functions
export const createSupabaseFunctions = async () => {
  // Create increment function if it doesn't exist
  const { error: incrementError } = await supabase.rpc("create_increment_function", {})
  if (incrementError && !incrementError.message.includes("already exists")) {
    console.error("Error creating increment function:", incrementError)
  }

  // Create decrement function if it doesn't exist
  const { error: decrementError } = await supabase.rpc("create_decrement_function", {})
  if (decrementError && !decrementError.message.includes("already exists")) {
    console.error("Error creating decrement function:", decrementError)
  }
}

// Initialize Supabase with required functions
export const initializeSupabase = async () => {
  try {
    // Create the reviews table if it doesn't exist
    const { error: reviewsTableError } = await supabase.rpc("create_reviews_table", {})
    if (reviewsTableError && !reviewsTableError.message.includes("already exists")) {
      console.error("Error creating reviews table:", reviewsTableError)
    }

    // Create the review_votes table if it doesn't exist
    const { error: votesTableError } = await supabase.rpc("create_review_votes_table", {})
    if (votesTableError && !votesTableError.message.includes("already exists")) {
      console.error("Error creating review_votes table:", votesTableError)
    }

    // Create the necessary functions
    await createSupabaseFunctions()

    console.log("Supabase initialized successfully")
  } catch (error) {
    console.error("Error initializing Supabase:", error)
  }
}

export default supabase
