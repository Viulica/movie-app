const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com';

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

export async function getMovieByIMDbId(imdbId) {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}`
    );
    
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

export async function searchMovies(query, year = null) {
  try {
    let url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
    if (year) {
      url += `&y=${year}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      return [];
    }
    
    return data.Search || [];
  } catch (error) {
    console.error('Error searching movies in OMDB:', error);
    throw error;
  }
}

