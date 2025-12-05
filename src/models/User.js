import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let User;
try {
  User = mongoose.models.User || mongoose.model('User', UserSchema);
} catch (error) {
  User = mongoose.model('User', UserSchema);
}

export default User;

