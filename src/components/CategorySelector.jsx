"use client"

const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: "popular", name: "Popular" },
    { id: "now_playing", name: "Now Playing" },
    { id: "top_rated", name: "Top Rated" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg transition ${
            selectedCategory === category.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategorySelector
