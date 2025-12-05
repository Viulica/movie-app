import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
  },
  releaseDate: {
    type: String,
  },
  posterPath: {
    type: String,
  },
  backdropPath: {
    type: String,
  },
  voteAverage: {
    type: Number,
  },
  voteCount: {
    type: Number,
  },
  genreIds: [{
    type: Number,
  }],
  genres: [{
    type: String,
  }],
  popularity: {
    type: Number,
  },
  imdbId: {
    type: String,
  },
  imdbRating: {
    type: String,
  },
  imdbVotes: {
    type: String,
  },
  plot: {
    type: String,
  },
  director: {
    type: String,
  },
  actors: {
    type: String,
  },
  writer: {
    type: String,
  },
  runtime: {
    type: String,
  },
  language: {
    type: String,
  },
  country: {
    type: String,
  },
  awards: {
    type: String,
  },
  boxOffice: {
    type: String,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

let Movie;
try {
  Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
} catch (error) {
  Movie = mongoose.model('Movie', MovieSchema);
}

export default Movie;

