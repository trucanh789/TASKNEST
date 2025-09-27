// routes/todoRoutes.js
import express from "express";
import { createTodo, getTodos, updateTodo, deleteTodo, stats } from "../controllers/todoController.js";

const router = express.Router();
router.post("/", createTodo);
router.get("/", getTodos);
router.get("/stats", stats);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
