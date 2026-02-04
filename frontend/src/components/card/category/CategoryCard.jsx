import CardContainer from "../common/CardContainer";

export default function CategoryCard({ categoryName, color }) {
  return (
    <CardContainer size="sm">
      <span
        style={{
          color,
          fontSize: "18px",
          fontWeight: 600,
          lineHeight: "1.3",
        }}
      >
        {categoryName}
      </span>
    </CardContainer>
  );
}
