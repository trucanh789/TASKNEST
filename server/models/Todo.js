// models/Todo.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model("Todo", todoSchema);
