import { useState, useEffect } from "react"; // ← これを追加
import { useParams, useLocation } from "react-router-dom";

import { useCategory } from "../categories/categoryHandlers";

import { useSchedule } from "../schedules/useSchedule";
import { useDateTime } from "../schedules/useDateTime";

import { useTodo } from "../todos/useTodo";
import TodoForm from "../todos/TodoForm";

import ScheduleCard from "../../components/ScheduleCard";
import ScheduleForm from "./ScheduleForm";

export default function ScheduleDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const dateId = location.state?.dateId;

  const { categories, setCategories } = useCategory();

  const {
    todos,
    fetchTodos,
    handleTodoCreate,
    handleTodoUpdate,
    handleTodoDelete,
  } = useTodo(id);
  const [todoForm, setTodoForm] = useState({
    title: "",
    priority: "",
    due_date: "" || null,
  });
  const [showTodoForm, setShowTodoForm] = useState(false);

  const {
    schedule,
    isEditMode,
    setIsEditMode,
    formData,
    handleChange,
    handleScheduleUpdate,
    handleScheduleDelete,
    error,
  } = useSchedule(id);

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
            <ScheduleCard
              schedule={schedule}
              todos={todos || []}
              setIsEditMode={setIsEditMode}
              handleTodoUpdate={handleTodoUpdate}
              handleTodoDelete={handleTodoDelete}
              handleScheduleDelete={handleScheduleDelete}
              showTodoForm={() => setShowTodoForm(true)}
            />
          ) : (
            <div>
              <TodoForm
                formData={todoForm}
                onChange={(e) =>
                  setTodoForm({ ...todoForm, [e.target.name]: e.target.value })
                }
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTodoCreate(todoForm);
                  setTodoForm({ title: "", priority: "", due_date: "" });
                  setShowTodoForm(false); // 送信後に戻る
                }}
                onCancel={() => setShowTodoForm(false)}
              />
            </div>
          )}
        </div>
      ) : (
        <ScheduleForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleScheduleUpdate}
          submitLabel="保存"
          categories={categories}
          onCancel={() => setIsEditMode(false)}
        />
      )}
    </div>
  );
}
