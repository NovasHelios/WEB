import RegionButton from "./RegionButton";

// 현재 단계의 지역 목록을 동일한 버튼 UI로 반복 렌더링합니다.
const RegionGrid = ({ regions, selectedCode, onSelect }) => {
  return (
    <>
      {regions.map((region) => (
        <RegionButton
          key={region.code}
          region={region}
          selected={selectedCode === region.code}
          onClick={onSelect}
        />
      ))}
    </>
  );
};

export default RegionGrid;
