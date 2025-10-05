// frontend/src/pages/todo/TodoList.jsx
import "./TodoList.css";

export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <div className="todo-list">
      {todos.map((t) => (
        <div key={t.id} className={`todo-item ${t.is_done ? "done" : ""}`}>
          <div className="todo-main">
            <label className="todo-title">
              <input
                type="checkbox"
                checked={t.is_done}
                onChange={() => onToggle(t)}
              />
              <span>{t.title}</span>
            </label>
            <div className="todo-meta">
              {t.priority && (
                <span className={`priority ${t.priority}`}>
                  優先度: {t.priority}
                </span>
              )}
              {t.due_date && (
                <span className="due-date">
                  期限: {new Date(t.due_date).toLocaleDateString("ja-JP")}
                </span>
              )}
            </div>
          </div>
          <button onClick={() => onDelete(t.id)} className="btn-delete">
            削除
          </button>
        </div>
      ))}
    </div>
  );
}
