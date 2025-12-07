const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com';

const POPULAR_MOVIE_TITLES = [
  'Inception',
  'The Dark Knight',
  'Interstellar',
  'Pulp Fiction',
  'The Matrix',
  'Fight Club',
  'Forrest Gump',
  'The Shawshank Redemption',
  'The Godfather',
  'Titanic',
  'Avatar',
  'Jurassic Park',
  'Star Wars',
  'The Avengers',
  'Iron Man',
  'Spider-Man',
  'Batman',
  'Superman',
  'Gladiator',
  'Braveheart',
];

export async function getMovieByTitle(title, year = null) {
  try {
    let url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
    if (year) {
      url += `&y=${year}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching movie from OMDB:', error);
    throw error;
  }
}

export function mapOMDBToMovie(omdbMovie) {
  const runtimeMatch = omdbMovie.Runtime?.match(/(\d+)/);
  const runtime = runtimeMatch ? parseInt(runtimeMatch[1]) : null;
  
  return {
    title: omdbMovie.Title,
    year: omdbMovie.Year ? parseInt(omdbMovie.Year) : 0,
    poster: omdbMovie.Poster && omdbMovie.Poster !== 'N/A' 
      ? omdbMovie.Poster 
      : null,
    rating: omdbMovie.imdbRating ? parseFloat(omdbMovie.imdbRating) : 0,
    genre: omdbMovie.Genre && omdbMovie.Genre !== 'N/A' 
      ? omdbMovie.Genre 
      : null,
    source: 'OMDB',
    sourceId: omdbMovie.imdbID || '',
  };
}

export function getPopularMovieTitles() {
  return POPULAR_MOVIE_TITLES;
}

