import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  poster: {
    type: String,
  },
  rating: {
    type: Number,
  },
  genre: {
    type: String,
  },
  source: {
    type: String,
    enum: ['TMDB', 'OMDB'],
    required: true,
  },
  sourceId: {
    type: String,
    required: true,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

MovieSchema.index({ source: 1, sourceId: 1 }, { unique: true });

let Movie;
try {
  Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
} catch (error) {
  Movie = mongoose.model('Movie', MovieSchema);
}

export default Movie;

