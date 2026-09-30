// styled-components를 사용해 검색 결과 패널과 토지 카드를 정의합니다.
import styled from "styled-components";

// NavBar 아래에서 지도 왼쪽을 덮는 검색 결과 패널입니다.
export const SearchPreviewPanel = styled.aside`
  position: fixed;
  top: 72px;
  bottom: 0;
  left: 0;
  z-index: 28;
  display: flex;
  width: min(320px, 100vw);
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #e5d6c3;
  background: #fffdf9;
  color: #222222;
`;

// 검색 결과 제목과 개수를 배치하는 상단 영역입니다.
export const SearchPreviewHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex: 0 0 auto;
  padding: 24px 20px 20px;
  border-bottom: 1px solid #e5d6c3;
  background: #ffffff;
`;

// 검색 결과 패널을 닫고 검색어를 초기화하는 버튼입니다.
export const SearchPreviewCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-top: -4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #4a4339;
  cursor: pointer;

  &:hover {
    background: #f4ecdf;
  }

  &:focus-visible {
    outline: 2px solid #b88620;
    outline-offset: 2px;
  }
`;

// 검색 결과 패널의 제목입니다.
export const SearchResultTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: var(--font-bold);
  line-height: 1.3;
`;

// 검색어와 조회된 토지 개수입니다.
export const SearchResultCount = styled.p`
  margin: 6px 0 0;
  overflow: hidden;
  color: #777777;
  font-size: 14px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 검색 결과 토지 카드가 세로로 쌓이는 스크롤 영역입니다.
export const ResultList = styled.div`
  display: grid;
  min-height: 0;
  gap: 16px;
  padding: 16px 12px 24px;
  overflow-y: auto;
  scrollbar-gutter: stable;
`;

// 토지 이미지와 정보를 함께 표시하는 클릭 가능한 카드입니다.
export const ResultCard = styled.button`
  width: 100%;
  padding: 0;
  overflow: hidden;
  border: 2px solid ${({ $selected }) => ($selected ? "#a76f00" : "#ead6bd")};
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 7px rgba(87, 61, 24, 0.06);
  color: #222222;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: #b88620;
  }

  &:focus-visible {
    outline: 3px solid rgba(184, 134, 32, 0.28);
    outline-offset: 2px;
  }
`;

// 카드 상단의 대표 이미지 고정 영역입니다.
export const ResultImageWrap = styled.div`
  width: 100%;
  height: 152px;
  overflow: hidden;
  background: #f4e5d3;
`;

// 서버에서 받은 토지 대표 이미지입니다.
export const ResultImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 대표 이미지가 없거나 로드에 실패했을 때 표시하는 영역입니다.
export const ResultImageFallback = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #737373;
`;

// 카드의 주소와 세부 정보를 배치하는 영역입니다.
export const ResultCardBody = styled.div`
  padding: 14px 14px 12px;
`;

// 토지 주소와 북마크 아이콘을 같은 행에 배치합니다.
export const ResultAddress = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  font-size: 15px;
  font-weight: var(--font-medium);
  line-height: 1.45;

  > span:first-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

// 면적처럼 라벨과 값을 나란히 표시하는 행입니다.
export const ResultInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  color: #777777;
  font-size: 13px;

  strong {
    color: #444444;
    font-weight: var(--font-normal);
  }
`;

// 가격 정보를 구분선 아래에 배치하는 행입니다.
export const ResultPriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5d6c3;
  font-size: 14px;
`;

// 검색 카드에서 강조되는 희망 가격입니다.
export const ResultPrice = styled.strong`
  font-size: 21px;
  font-weight: var(--font-bold);
`;

// 로딩과 오류 상태에 공통으로 사용하는 안내 문구입니다.
export const StatusMessage = styled.p`
  margin: 0;
  padding: 28px 20px;
  color: ${({ $error }) => ($error ? "#dc2626" : "#666666")};
  font-size: 14px;
  text-align: center;
`;

// 검색 결과가 없을 때 표시하는 안내 문구입니다.
export const EmptyMessage = styled.p`
  margin: 0;
  padding: 40px 20px;
  color: #777777;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
`;
