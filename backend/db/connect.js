import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  const mongoUri = uri || process.env.MONGO_URL;
  if (!mongoUri) throw new Error('MongoDB connection error');
  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
  console.log("MongoDB connected successfully");
}
