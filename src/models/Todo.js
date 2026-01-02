import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this todo.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  fileUrl: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: false, // Optional for now to support migration/existing, or guest mode
  },
}, { timestamps: true });

export default mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
