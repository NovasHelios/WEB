import { SearchForm, SearchIconButton, SearchInput } from "./Search.styled";

function Search({ keyword, onChangeKeyword, onSearch }) {
  return (
    // 검색창 전체를 form으로 구성
    // Enter 입력 또는 검색 버튼 클릭 시 onSubmit 실행
    <SearchForm
      onSubmit={(event) => {
        // form 기본 동작인 페이지 새로고침 방지
        event.preventDefault();

        // 부모 컴포넌트(Map.jsx)에서 전달받은 검색 함수 실행
        onSearch();
      }}
    >
      {/* 돋보기 버튼 */}
      {/* type="submit"이므로 클릭하면 SearchForm의 onSubmit 실행 */}
      <SearchIconButton type="submit" aria-label="주소 검색">
        🔍
      </SearchIconButton>

      {/* 주소 입력창 */}
      <SearchInput
        // 부모 컴포넌트가 관리하는 검색어 값
        value={keyword}
        // 입력값이 바뀔 때 부모의 state 변경 함수 실행
        onChange={(event) => onChangeKeyword(event.target.value)}
        placeholder="주소를 입력하세요"
      />
    </SearchForm>
  );
}

export default Search;
