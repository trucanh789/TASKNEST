import { useEffect, useState } from "react";
import API from "../api";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [stats, setStats] = useState({ completed: 0, pending: 0 });

  const fetchTodos = async () => {
    const res = await API.get("/todos", { params: { status, from, to, page, limit: 5 } });
    setTodos(res.data.todos);
    setPages(res.data.pages);
  };

  const fetchStats = async () => {
    const res = await API.get("/todos/stats");
    setStats(res.data);
  };

  const addTodo = async () => {
    if (!title) return;
    await API.post("/todos", { title, dueDate: new Date() });
    setTitle("");
    fetchTodos();
    fetchStats();
  };

  const toggleStatus = async (id, status) => {
    await API.put(`/todos/${id}`, { status: !status });
    fetchTodos();
    fetchStats();
  };

  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    fetchTodos();
    fetchStats();
  };

  useEffect(() => { fetchTodos(); }, [status, from, to, page]);
  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">TaskNest</h1>

        {/* Add form */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-lg p-2 focus:outline-blue-400"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter task..."
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <select onChange={e => setStatus(e.target.value)} className="border rounded-lg p-2">
            <option value="">All</option>
            <option value="true">Done</option>
            <option value="false">Pending</option>
          </select>
          <input type="date" onChange={e => setFrom(e.target.value)} className="border rounded-lg p-2" />
          <input type="date" onChange={e => setTo(e.target.value)} className="border rounded-lg p-2" />
        </div>

        {/* List */}
        <ul className="space-y-2">
          {todos.map(t => (
            <li key={t._id} className="flex justify-between items-center bg-gray-50 border rounded-lg px-4 py-2">
              <span className={t.status ? "line-through text-gray-400" : "text-gray-800"}>{t.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(t._id, t.status)}
                  className={`px-3 py-1 rounded-lg text-white text-sm ${t.status ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                >
                  {t.status ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteTodo(t._id)}
                  className="px-3 py-1 rounded-lg text-white text-sm bg-red-500 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-600">Page {page} / {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 flex justify-around text-lg font-medium">
          <p className="text-green-600">Completed: {stats.completed}</p>
          <p className="text-yellow-600">Pending: {stats.pending}</p>
        </div>
      </div>
    </div>
  );
}
