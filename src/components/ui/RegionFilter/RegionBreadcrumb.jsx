// 선택된 지역 단계와 되돌아가기 버튼을 표시합니다.
const RegionBreadcrumb = ({ selectedRegion, onBackToSido, onBackToSigungu }) => {
  return (
    <div>
      {selectedRegion.sido ? (
        <button type="button" onClick={onBackToSido}>
          {selectedRegion.sido.name}
        </button>
      ) : (
        <span>시도 선택</span>
      )}

      <span> &gt; </span>

      {selectedRegion.sigungu ? (
        <button type="button" onClick={onBackToSigungu}>
          {selectedRegion.sigungu.name}
        </button>
      ) : (
        <span>시·군·구 선택</span>
      )}

      <span> &gt; </span>

      <span>{selectedRegion.emd?.name || "읍·면·동 선택"}</span>
    </div>
  );
};

export default RegionBreadcrumb;
