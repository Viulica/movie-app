import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema({
  lastfmId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
  image: [{
    url: String,
    size: String,
  }],
  playcount: {
    type: Number,
  },
  listeners: {
    type: Number,
  },
  url: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  wiki: {
    summary: String,
    content: String,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

let Track;
try {
  Track = mongoose.models.Track || mongoose.model('Track', TrackSchema);
} catch (error) {
  Track = mongoose.model('Track', TrackSchema);
}

export default Track;

