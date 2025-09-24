// frontend/src/pages/todo/useTodo.js
import { useState } from "react";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../context/AuthContext";


export function useTodo(scheduleId) {
    const { accessToken, refreshToken, handleRefresh } = useAuth();
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");

    const base_todo_url = `/schedules/${scheduleId}/todos/`

    // 一覧取得
    const fetchTodos = async () => {
        const res = await apiFetch(
            `${base_todo_url}`,
            { method: "GET" },
            { accessToken, refreshToken, handleRefresh }
        );
        setTodos(res);
        
    };

    // 作成
    const handleTodoCreate = async (newTodo) => {
        await apiFetch(
            `${base_todo_url}`,
            {
                method: "POST",
                body: JSON.stringify({ ...newTodo, schedule_id: scheduleId }),
            },
            { accessToken, refreshToken, handleRefresh }
        );
        fetchTodos();
    };

    // 更新（例: 完了トグル）
    const handleTodoUpdate = async (todoId, payload) => {
        await apiFetch(
            `${base_todo_url}${todoId}`,
            {
                method: "PUT",
                body: JSON.stringify(payload),
            },
            { accessToken, refreshToken, handleRefresh }
        );
        fetchTodos();
    };

    // 削除
    const handleTodoDelete = async (todoId) => {
        await apiFetch(
            `${base_todo_url}${todoId}`,
            { method: "DELETE" },
            { accessToken, refreshToken, handleRefresh }
        );
        fetchTodos();
    };

    return { todos, error, fetchTodos, handleTodoCreate, handleTodoUpdate, handleTodoDelete };
}