import { PRIORITIES } from "../../constants/priority";
import "./TodoForm.css";

export default function TodoForm({ formData, onChange, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="todo-form">
            <div>
                <label>タイトル</label>
                <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={onChange}
                required
                />
            </div>

            <div>
                <label>優先度</label>
                <select
                name="priority"
                value={formData.priority || ""}
                onChange={onChange}
                required
                >
                <option value="">選択してください</option>
                {PRIORITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                    {c.label}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label>期限</label>
                <input
                type="date"
                name="due_date"
                value={formData.due_date || ""}
                onChange={onChange}
                />
            </div>

            <button type="submit">追加</button>
        </form>
    );
}