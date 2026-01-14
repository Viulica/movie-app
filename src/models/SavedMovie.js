import mongoose from "mongoose";
const SavedMovieSchema = new mongoose.Schema
({
  userId: {
    type: String
  },
  movieId : {
    type: String
  },
  rating : {
    type: Number
  }
},
{ timestamps: true });

SavedMovieSchema.index({ userId: 1, movieId: 1 }, { unique: true });

let SavedMovie;
try {
  SavedMovie = mongoose.models.SavedMovie || mongoose.model('SavedMovie', SavedMovieSchema);
} catch (error) {
  SavedMovie = mongoose.model('SavedMovie', SavedMovieSchema);
}

export default SavedMovie;