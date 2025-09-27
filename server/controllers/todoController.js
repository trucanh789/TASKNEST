// controllers/todoController.js
import Todo from "../models/Todo.js";

// Create
export const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read with filter + pagination
export const getTodos = async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 5 } = req.query;
    const query = {};
    if (status) query.status = status === "true";
    if (from && to) query.createdAt = { $gte: new Date(from), $lte: new Date(to) };

    const todos = await Todo.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const count = await Todo.countDocuments(query);

    res.json({ todos, total: count, page, pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Stats
export const stats = async (req, res) => {
  try {
    const completed = await Todo.countDocuments({ status: true });
    const pending = await Todo.countDocuments({ status: false });
    res.json({ completed, pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
