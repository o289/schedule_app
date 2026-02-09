import { useState, useEffect } from "react"; // ← これを追加
import { useParams, useLocation } from "react-router-dom";

import { useCategory } from "../categories/categoryHandlers";

import { useSchedule } from "../schedules/useSchedule";
import { useDateTime } from "../schedules/useDateTime";

import { useTodo } from "../todos/useTodo";
import TodoForm from "../todos/TodoForm";

import ScheduleCard from "../../components/card/schedule/ScheduleCard";
import ScheduleForm from "./ScheduleForm";
import Loading from "../../components/Loading";

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
    due_date: null,
  });
  const [showTodoForm, setShowTodoForm] = useState(false);

  const {
    schedule,
    isFetching,
    isEditMode,
    setIsEditMode,
    formData,
    fetchSchedule,
    handleChange,
    handleScheduleUpdate,
    handleScheduleDelete,
  } = useSchedule(id);

  useEffect(() => {
    if (id) {
      fetchSchedule();
      fetchTodos();
    }
  }, [id]);

  if (isFetching || !schedule) {
    return <Loading />;
  }

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
                onChange={(e) => {
                  const { name, value } = e.target;
                  setTodoForm({
                    ...todoForm,
                    [name]: name === "due_date" && value === "" ? null : value,
                  });
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTodoCreate(todoForm);
                  setTodoForm({ title: "", priority: "", due_date: null });
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
