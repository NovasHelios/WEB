// 지역 하나를 표시하는 공통 버튼 컴포넌트입니다.
const RegionButton = ({ region, selected, onClick }) => {
  return (
    <button
      type="button"
      className={selected ? "selected" : ""}
      onClick={() => onClick(region)}
    >
      {region.name}
    </button>
  );
};

export default RegionButton;
