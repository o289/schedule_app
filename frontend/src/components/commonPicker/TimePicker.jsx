import { TIME_OPTIONS } from "./timeOptions";
import { getConstraints } from "./timeConstraints";

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  label: {
    width: "48px",
    fontSize: "14px",
  },
  pickerWrapper: {
    flex: 1,
    position: "relative",
  },
  select: {
    width: "100%",
    height: "42px",
    padding: "0 36px 0 12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    appearance: "none",
    cursor: "pointer",
  },
  arrow: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "10px",
    pointerEvents: "none",
  },
};

export default function TimePicker({
  label,
  value,
  mode,
  constraintValue,
  onChange,
}) {
  const { min, max } = getConstraints(constraintValue, mode);

  const options = TIME_OPTIONS.filter((time) => {
    if (min && time < min) return false;
    if (max && time > max) return false;
    return true;
  });

  return (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      <div style={styles.pickerWrapper}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.select}
        >
          {options.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <span style={styles.arrow}>▼</span>
      </div>
    </div>
  );
}
