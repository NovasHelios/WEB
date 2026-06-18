import styled from "styled-components";

// 검색창 전체 form
export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  width: 438px;
  height: 65px;
  padding: 0 24px;
  border-radius: 999px;
  background: white;
`;

// 돋보기 아이콘 버튼
export const SearchIconButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin-right: 16px;
  font-size: 22px;
  cursor: pointer;
`;

// 실제 주소 입력 input
export const SearchInput = styled.input`
  flex: 1;
  border: 0;
  outline: none;
  font-size: 24px;
  background: transparent;
`;
