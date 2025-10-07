import BaseForm from "../../components/forms/BaseForm";
import FormField from "../../components/forms/FormField";

import { PRIORITIES } from "../../constants/priority";

export default function TodoForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <BaseForm onSubmit={onSubmit} onCancel={onCancel} submitLabel="ToDo追加">
      <FormField label="タイトル">
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={onChange}
          required
        />
      </FormField>
      <FormField label="優先度">
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
      </FormField>
      <FormField label="期限">
        <input
          type="date"
          name="due_date"
          value={formData.due_date || ""}
          onChange={onChange}
        />
      </FormField>
    </BaseForm>
  );
}
