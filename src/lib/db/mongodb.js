import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
  }

  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // Only log in development
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        console.log('[OK] MongoDB connected successfully');
      }
      return mongoose;
    }).catch((error) => {
      // Log errors in all environments but don't expose details in production
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        console.error('[ERROR] MongoDB connection error:', error);
      } else {
        console.error('[ERROR] MongoDB connection failed');
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
