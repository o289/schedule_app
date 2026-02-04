// src/components/card/CardContainer.jsx

import "./CardContainer.css";

export default function CardContainer({ size = "md", children }) {
  return <div className={`card-ui card-ui--${size}`}>{children}</div>;
}
