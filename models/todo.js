import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  itemName: { type: String, unique: true },
  itemType: { type: [String] }
});

export default mongoose.model('Todo', todoSchema);
