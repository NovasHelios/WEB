import styled from "styled-components";

// 동일 필지 목록을 중앙 팝업으로 띄우고 배경과 분리합니다.
export const ListingsBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 14px;
  background: rgba(22, 24, 29, 0.76);
  box-sizing: border-box;
`;

// 등록 건수가 늘어나도 팝업 안에서 목록을 스크롤합니다.
export const ListingsDialog = styled.section`
  display: flex;
  width: min(100%, 480px);
  max-height: min(96vh, 900px);
  flex-direction: column;
  overflow: hidden;
  padding: 28px;
  border: 1px solid #e0e4eb;
  border-radius: 14px;
  background: #fff;
  color: #172033;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);

  @media (max-width: 520px) {
    padding: 22px 18px;
    border-radius: 12px;
  }
`;

// 제목과 닫기 버튼을 팝업의 첫 줄에 정렬합니다.
export const ListingsHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const ListingsCloseButton = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #9ba1aa;
  cursor: pointer;
`;

export const ListingsTitle = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.35;
  font-weight: 750;
`;

export const ListingsSubtitle = styled.p`
  margin: 7px 0 0;
  color: #687386;
  font-size: var(--font-sm);
  line-height: 1.5;
`;

// 공통 필지 주소와 전체 등록 건수를 간결하게 보여줍니다.
export const ParcelSummary = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 22px;
  padding: 18px 20px;
  border: 1px solid #e0e4eb;
  border-radius: 16px;
  box-shadow: 0 2px 5px rgba(23, 32, 51, 0.04);

  strong { font-size: 1rem; line-height: 1.45; }
  span { color: #4d596c; font-size: var(--font-sm); }
  small { color: #97a0af; font-size: var(--font-xs); }
`;

// 거래 유형별 건수를 칩으로 전환합니다.
export const ListingFilters = styled.div`
  display: flex;
  gap: 8px;
  margin: 22px 0 18px;
  overflow-x: auto;
  padding-bottom: 2px;
`;

export const ListingFilter = styled.button`
  min-height: 40px;
  flex: 0 0 auto;
  padding: 0 17px;
  border: 1px solid ${({ $active }) => ($active ? "#c99400" : "#e0e4eb")};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#fffaf0" : "#fff")};
  color: ${({ $active }) => ($active ? "#263143" : "#566174")};
  font: inherit;
  font-size: var(--font-sm);
  font-weight: 650;
  white-space: nowrap;
  cursor: pointer;
`;

// 각 등록 내용을 한 카드로 구성해 거래 조건을 비교하기 쉽게 합니다.
export const ListingCards = styled.div`
  display: grid;
  gap: 14px;
  min-height: 0;
  overflow-y: auto;
  padding: 0 2px 2px 0;
`;

export const ListingCard = styled.article`
  padding: 20px 22px;
  border: 1px solid ${({ $selected }) => ($selected ? "#c99400" : "#e0e4eb")};
  border-width: ${({ $selected }) => ($selected ? "2px" : "1px")};
  border-radius: 18px;
  background: #fff;
`;

export const ListingType = styled.p`
  margin: 0;
  color: #526074;
  font-size: var(--font-sm);
`;

export const ListingPrice = styled.strong`
  display: block;
  margin-top: 9px;
  color: #172033;
  font-size: 1.5rem;
  line-height: 1.35;
  font-weight: 750;
`;

export const ListingMeta = styled.p`
  margin: 8px 0 18px;
  color: #748095;
  font-size: var(--font-sm);
`;

export const ListingDetailButton = styled.button`
  border-color: ${({ $selected }) => ($selected ? "#c99400" : "#dfe3ea")};
  background: ${({ $selected }) => ($selected ? "#c99400" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#fff" : "#172033")};
  width: 100%;
  min-height: 48px;
  border: 1px solid;
  border-radius: 13px;
  background: #fff;
  color: #172033;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

`;

// 안내 문구를 스크롤 목록 아래에 분리해 배치합니다.
export const ListingsFooter = styled.p`
  flex: 0 0 auto;
  margin: 20px 0 0;
  padding-top: 4px;
  color: #748095;
  font-size: var(--font-xs);
  line-height: 1.6;
`;
