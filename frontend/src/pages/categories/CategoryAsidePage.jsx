import { useState, useEffect } from "react";
import { useCategory } from "./categoryHandlers";

import { Button } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import CategoryPanel from "./CategoryPanel";
import Loading from "../../components/Loading";

export default function CategoryAsidePage({ setAsideMode }) {
  const {
    categories,
    form,
    isFetching,
    editingId,
    handleChange,
    handleSubmit,
    handleEditClick,
    handleCancelEdit,
    handleDelete,
  } = useCategory();

  const [expanded, setExpanded] = useState(false);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <CategoryPanel
      categories={categories}
      formData={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      expanded={expanded}
      editingCategory={editingId}
      onDelete={handleDelete}
      onEdit={handleEditClick}
      onToggle={() => setExpanded((prev) => !prev)}
      onCancelEdit={handleCancelEdit}
      setAsideMode={setAsideMode}
    />
  );
}
