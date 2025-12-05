import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Movie from '@/models/Movie';
import { getPopularMovies, getMovieDetails } from '@/lib/themoviedb';
import { getMovieByTitle } from '@/lib/omdb';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const movieId = searchParams.get('id');
    const filter = searchParams.get('filter');
    const value = searchParams.get('value');

    if (action === 'fetch') {
      let query = {};
      
      if (filter && value) {
        if (filter === 'year') {
          query.releaseDate = { $regex: value, $options: 'i' };
        } else if (filter === 'genre') {
          query.genres = { $in: [value] };
        } else         if (filter === 'rating') {
          const minRating = parseFloat(value);
          query.voteAverage = { $gte: minRating };
        } else if (filter === 'title') {
          query.title = { $regex: value, $options: 'i' };
        } else if (filter === 'director') {
          query.director = { $regex: value, $options: 'i' };
        } else if (filter === 'imdbRating') {
          const minRating = parseFloat(value);
          query.imdbRating = { $gte: minRating.toString() };
        }
      }

      const movies = await Movie.find(query).sort({ fetchedAt: -1 }).limit(100);
      return NextResponse.json({ success: true, data: movies });
    }

    if (action === 'details' && movieId) {
      const movie = await Movie.findOne({ tmdbId: parseInt(movieId) });
      if (movie) {
        return NextResponse.json({ success: true, data: movie });
      }
      return NextResponse.json({ success: false, message: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/movies:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const { action, count = 20 } = await request.json();

    if (action === 'fetch-and-save') {
      const movies = await getPopularMovies(1);
      const moviesToSave = movies.slice(0, parseInt(count));

      const savedMovies = [];

      for (const movie of moviesToSave) {
        try {
          const existing = await Movie.findOne({ tmdbId: movie.id });
          
          if (!existing) {
            const details = await getMovieDetails(movie.id);
            
            let omdbData = null;
            try {
              const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
              omdbData = await getMovieByTitle(movie.title, year);
            } catch (omdbError) {
              console.log(`OMDB data not found for ${movie.title}, continuing without it`);
            }
            
            const movieData = {
              tmdbId: movie.id,
              title: movie.title,
              overview: movie.overview || '',
              releaseDate: movie.release_date || '',
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
              voteAverage: movie.vote_average,
              voteCount: movie.vote_count,
              genreIds: movie.genre_ids || [],
              genres: details.genres?.map(g => g.name) || [],
              popularity: movie.popularity,
              imdbId: omdbData?.imdbID || null,
              imdbRating: omdbData?.imdbRating || null,
              imdbVotes: omdbData?.imdbVotes || null,
              plot: omdbData?.Plot || movie.overview || '',
              director: omdbData?.Director || null,
              actors: omdbData?.Actors || null,
              writer: omdbData?.Writer || null,
              runtime: omdbData?.Runtime || null,
              language: omdbData?.Language || null,
              country: omdbData?.Country || null,
              awards: omdbData?.Awards || null,
              boxOffice: omdbData?.BoxOffice || null,
            };

            const saved = await Movie.create(movieData);
            savedMovies.push(saved);
          } else {
            savedMovies.push(existing);
          }
        } catch (error) {
          console.error(`Error saving movie ${movie.id}:`, error);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `Saved ${savedMovies.length} movies`,
        data: savedMovies 
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/movies:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('id');
    const deleteAll = searchParams.get('all') === 'true';

    if (deleteAll) {
      const result = await Movie.deleteMany({});
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.deletedCount} movies` 
      });
    }

    if (movieId) {
      const result = await Movie.deleteOne({ tmdbId: parseInt(movieId) });
      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, message: 'Movie not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Movie deleted' });
    }

    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error in DELETE /api/movies:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

