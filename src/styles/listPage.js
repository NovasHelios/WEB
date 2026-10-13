import styled, { css } from "styled-components";

// 목록 화면의 소개 영역 아래에 동일한 색상과 간격의 분리선을 표시합니다.
export const ListPageDivider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 2rem 0 0;
  border: 0;
  background: #e6e1d8;
`;

// 기존 사업 연결의 최대 너비(94.5rem) 바깥 여백과 패딩을 합쳐 절반으로 줄입니다.
export const listPageShell = css`
  width: 100%;
  max-width: none;
  margin: 0;
  box-sizing: border-box;
  padding: 2.5rem calc(max(0rem, (100% - 94.5rem) / 4) + var(--page-inline-padding) / 2) 3.5rem;
  @media (max-width: 40rem) {
    padding: 1.75rem 0.625rem 2.5rem;
  }
`;

// 세 목록 화면의 제목은 기존 사업 연결과 동일한 규격을 공유합니다.
export const listPageTitle = css`
  margin: 0;
  color: #1f1f1f;
  font-family: var(--font-family-base);
  font-size: var(--font-page-title);
  font-weight: var(--font-bold);
  line-height: 1.2;
  letter-spacing: normal;
  @media (max-width: 40rem) { font-size: 2.25rem; }
`;

// 설명의 글자 크기뿐 아니라 굵기·줄 높이·제목과의 간격도 통일합니다.
export const listPageDescription = css`
  margin: 1.5rem 0 0;
  color: #4f4b43;
  font-family: var(--font-family-base);
  font-size: 1.125rem;
  font-weight: var(--font-medium);
  line-height: 1.65;
  letter-spacing: normal;
  @media (max-width: 40rem) {
    font-size: 0.9375rem;
    br { display: none; }
  }
`;
