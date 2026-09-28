// styled-components를 사용해 사업 연결 페이지 디자인을 정의합니다.
import styled from "styled-components";

// 사업 연결 페이지의 전체 배경입니다.
export const BusinessPageRoot = styled.div`
  min-height: 100vh;
  background: #f8f7f3;
  color: #1f1f1f;
`;

// 제목과 사업자 목록을 가운데 정렬하는 본문입니다.
export const BusinessMain = styled.main`
  width: min(100%, 1512px);
  margin: 0 auto;
  padding: 40px 32px 56px;

  @media (max-width: 640px) {
    padding: 28px 20px 40px;
  }
`;

// 페이지 제목과 설명을 묶는 상단 영역입니다.
export const BusinessHeader = styled.header`
  width: 100%;
`;

// 사업 연결 페이지의 대표 제목입니다.
export const BusinessTitle = styled.h1`
  margin: 0;
  color: #1f1f1f;
  font-size: 52px;
  font-weight: var(--font-bold);
  line-height: 1.2;

  @media (max-width: 640px) {
    font-size: 36px;
  }
`;

// 사업 연결 페이지의 목적을 설명하는 문장입니다.
export const BusinessDescription = styled.p`
  margin: 24px 0 0;
  color: #4f4b43;
  font-size: 18px;
  font-weight: var(--font-medium);
  line-height: 1.65;

  @media (max-width: 640px) {
    font-size: 15px;

    br {
      display: none;
    }
  }
`;

// 페이지 소개와 사업자 목록을 구분하는 선입니다.
export const BusinessDivider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 32px 0 0;
  border: 0;
  background: #e6e1d8;
`;

// 사업자 카드를 반응형 열로 배치하는 목록입니다.
export const BusinessGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 350px);
  gap: 16px;
  justify-content: start;
  margin-top: 40px;

  @media (max-width: 1480px) {
    grid-template-columns: repeat(3, 350px);
  }

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, 350px);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

// 한 명의 사업자 정보를 표시하는 카드입니다.
export const BusinessCardContainer = styled.article`
  display: flex;
  width: min(100%, 350px);
  height: 510px;
  min-width: 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px 16px;
  border: 1px solid #efebe3;
  border-radius: 28px;
  background: #ffffff;
  text-align: center;
`;

// 원형 프로필 이미지가 들어가는 고정 크기 영역입니다.
export const BusinessProfileWrap = styled.div`
  width: 250px;
  height: 250px;
  flex: 0 0 250px;
  overflow: hidden;
  border-radius: 50%;
  background: #6f706f;
`;

// API에서 받은 사업자 프로필 이미지입니다.
export const BusinessProfileImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 프로필 이미지가 없을 때 표시되는 기본 아이콘 영역입니다.
export const BusinessProfileFallback = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #f2f2f2;
`;

// 사업자 이름입니다.
export const BusinessName = styled.h2`
  margin: 16px 0 0;
  color: #111111;
  font-size: 28px;
  font-weight: var(--font-bold);
  line-height: 1.25;
`;

// 사업자가 소속된 회사명입니다.
export const BusinessCompany = styled.p`
  margin: 20px 0 0;
  color: #252525;
  font-size: 20px;
  line-height: 1.4;
`;

// 사업자가 소속된 부서명입니다.
export const BusinessDepartment = styled.p`
  margin: 0;
  color: #6a6a6a;
  font-size: 18px;
  line-height: 1.4;
`;

// 사업자가 자신 있는 전문 분야입니다.
export const BusinessSpecialty = styled.p`
  margin: 18px 0 0;
  color: #4a4a4a;
  font-size: 18px;
  font-weight: var(--font-bold);
  line-height: 1.45;
`;

// 사업자의 현재 상담 가능 상태입니다.
export const BusinessAvailability = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  padding: 5px 7px;
  border-radius: 4px;
  background: ${({ $available }) => ($available ? "#ffe69a" : "#eeeeee")};
  color: ${({ $available }) => ($available ? "#413100" : "#777777")};
  font-size: 16px;

  svg {
    color: ${({ $available }) => ($available ? "#18b52a" : "#999999")};
  }
`;
