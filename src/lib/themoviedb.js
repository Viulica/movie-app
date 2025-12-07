const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function getPopularMovies(page = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

export function mapTMDBToMovie(tmdbMovie) {
  const year = tmdbMovie.release_date 
    ? new Date(tmdbMovie.release_date).getFullYear() 
    : null;
  
  return {
    title: tmdbMovie.title,
    year: year || 0,
    poster: tmdbMovie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` 
      : null,
    rating: tmdbMovie.vote_average || 0,
    genre: tmdbMovie.genre_ids?.length > 0 ? 'Various' : null,
    source: 'TMDB',
    sourceId: tmdbMovie.id.toString(),
  };
}

export async function getMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

