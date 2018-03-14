import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  itemName: { type: String, unique: true },
  itemType: { type: [String] }
});

export default mongoose.model('Todo', todoSchema);
