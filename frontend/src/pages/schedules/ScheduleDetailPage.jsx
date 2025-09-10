import { useState, useEffect } from "react";   // ← これを追加
import ScheduleForm from "./ScheduleForm";
import useScheduleDetail from "./useScheduleDetail"; 
import { useParams, Link } from "react-router-dom";
import { useTodo } from "../todos/useTodo";
import TodoList from "../todos/TodoList";
import TodoForm from "../todos/TodoForm";

import "./ScheduleDetail.css"

export default function ScheduleDetailPage() {
    const { id } = useParams();
    
    const { todos, fetchTodos, createTodo, updateTodo, deleteTodo } = useTodo(id);

    const [todoForm, setTodoForm] = useState({ title: "", priority: "", due_date: "" || null});
    const [showTodoForm, setShowTodoForm] = useState(false);

    const {
        schedule,
        categories,
        error,
        isEditMode,
        setIsEditMode,
        formData,
        handleChange,
        handleUpdate,
        handleDelete,
        darkenColor,
    } = useScheduleDetail(id);
    

    useEffect(() => {
        if (id) {
          fetchTodos();
        }
      }, [id]);

    if (!schedule) return <p>読み込み中...</p>;

    return (
        <div style={{ padding: "1rem" }}>
      {!isEditMode ? (
            <div>
            {!showTodoForm ? (
                <>
                <div
                    className="schedule-card"
                    style={{
                    "--category-color": schedule.category?.color || "#4a90e2",
                    "--category-color-dark": darkenColor(schedule.category?.color || "#4a90e2"),
                    }}
                >
                    <h2 className="schedule-title">{schedule.title}</h2>

                    <p className="schedule-time">
                    {new Date(schedule.start_time).toLocaleDateString("ja-JP", {
                        month: "long",
                        day: "numeric",
                    })}
                    </p>
                    <p className="schedule-time">
                    {new Date(schedule.start_time).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}{" "}
                    ~{" "}
                    {new Date(schedule.end_time).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                    </p>

                    <p className="schedule-category">
                    <span style={{ color: schedule.category?.color }}>
                        {schedule.category?.name}
                    </span>
                    </p>

                    {schedule.note && <p className="schedule-note">{schedule.note}</p>}

                    <TodoList
                    todos={todos}
                    onToggle={(t) => updateTodo(t.id, { is_done: !t.is_done })}
                    onDelete={deleteTodo}
                    />

                    <div className="schedule-actions">
                    <Link to="/schedules" className="btn-link">
                        一覧へ戻る
                    </Link>
                    <div>
                        <button className="btn-edit" onClick={() => setIsEditMode(true)}>
                            編集
                        </button>
                        <button className="btn-delete" onClick={handleDelete}>
                            削除
                        </button>
                        <button
                            className="btn-edit"
                            style={{ marginLeft: "1rem" }}
                            onClick={() => setShowTodoForm(true)}
                        >
                            Todo追加
                        </button>
                    </div>
                    </div>
                </div>
                </>
            ) : (
                <div>
                <TodoForm
                    formData={todoForm}
                    onChange={(e) =>
                    setTodoForm({ ...todoForm, [e.target.name]: e.target.value })
                    }
                    onSubmit={(e) => {
                    e.preventDefault();
                    createTodo(todoForm);
                    setTodoForm({ title: "", priority: "", due_date: "" });
                    setShowTodoForm(false); // 送信後に戻る
                    }}
                />
                <button
                    className="btn-cancel"
                    style={{ marginTop: "1rem" }}
                    onClick={() => setShowTodoForm(false)}
                >
                    キャンセル
                </button>
                </div>
            )}
            </div>
        ) : (
            <ScheduleForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleUpdate}
            submitLabel="保存"
            categories={categories}
            useDateTime={true}
            />
        )}
        </div>
    );
}