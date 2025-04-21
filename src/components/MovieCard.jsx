import React from 'react';

const MovieCard = ({ movie, onSave }) => {
  const posterUrl = movie.Poster !== "N/A" 
    ? movie.Poster 
    : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
      <img 
        src={posterUrl} 
        alt={movie.Title} 
        className="w-full h-64 object-cover" 
      />
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold mb-1">{movie.Title}</h3>
        <p className="text-gray-600 mb-2">{movie.Year}</p>
        <p className="text-sm text-gray-500 mb-4">{movie.Type}</p>
      </div>
      <button
        onClick={() => onSave(movie)}
        className="mt-auto mx-4 mb-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Save to Favorites
      </button>
    </div>
  );
};

export default MovieCard;