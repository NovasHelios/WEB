import {
  Actions,
  BookmarkButton,
  CloseButton,
  ContactButton,
  Description,
  ImagePlaceholder,
  InfoGrid,
  Label,
  LandImage,
  Panel,
  Section,
  Value,
} from "./SpecificLand.styled";

// 마커를 클릭했을 때 지도 위에 표시되는 특정 토지 상세 패널
function SpecificLand({ land, onClose }) {
  // 선택된 토지가 없으면 패널을 렌더링하지 않음
  if (!land) return null;

  // 희망 가격을 원 단위 콤마 형식으로 표시
  const price = Number(land.desiredPrice || 0).toLocaleString();

  // 서버 area가 제곱미터 기준이라고 가정하고 평수로 변환
  const areaPyeong = Math.round(Number(land.area || 0) / 3.3058);

  return (
    <Panel>
      {/* 상세 패널 닫기 버튼 */}
      <CloseButton type="button" onClick={onClose}>
        ×
      </CloseButton>

      {/* 서버에서 받은 토지 이미지가 있으면 표시하고, 없으면 빈 이미지 영역 표시 */}
      {land.landImagePath ? (
        <LandImage src={land.landImagePath} alt="토지 이미지" />
      ) : (
        <ImagePlaceholder />
      )}

      {/* 주소 영역 */}
      <Section>
        <Label>주소 (ADDRESS)</Label>
        <Value>{land.address}</Value>
      </Section>

      {/* 가격 / 면적 / 지목 정보 영역 */}
      <Section>
        <InfoGrid>
          <div>
            <Label>금액 (PRICE)</Label>
            <Value>{price}원</Value>
          </div>

          <div>
            <Label>면적 (AREA)</Label>
            <Value>{areaPyeong}평</Value>
          </div>

          <div>
            <Label>지목 (CATEGORY)</Label>
            <Value>{land.lcCodeNm || "-"}</Value>
          </div>
        </InfoGrid>
      </Section>

      {/* 설명 영역 */}
      <Section>
        <Label>설명 (DESCRIPTION)</Label>
        <Description>
          {land.description || "등록된 설명이 없습니다."}
        </Description>
      </Section>

      {/* 하단 버튼 영역 */}
      <Actions>
        <ContactButton type="button">담당자에게 문의하기</ContactButton>
        <BookmarkButton type="button">관심등록</BookmarkButton>
      </Actions>
    </Panel>
  );
}

export default SpecificLand;
