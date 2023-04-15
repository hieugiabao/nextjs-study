import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

let globalWithMongoose = global as typeof globalThis & {
  _mongoose: { conn: any; promise: any };
};
let cached = globalWithMongoose._mongoose;

if (!cached) {
  cached = globalWithMongoose._mongoose = { conn: null, promise: null };
}

export async function mongooseConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}
