import {
  ActionBar,
  BookmarkButton,
  CloseButton,
  ContactButton,
  Description,
  DetailGrid,
  DetailItem,
  Divider,
  ImagePlaceholder,
  InfoGrid,
  Label,
  LandImage,
  Panel,
  PanelBody,
  Section,
  StatusBadge,
  StatusBadges,
  UpdatedAt,
  Value,
} from "./SpecificLand.styled";

function SpecificLand({ land, onClose }) {
  if (!land) return null;

  const address =
    land.address || `${land.ldCodeNm || ""} ${land.mnnmSlno || ""}`.trim();

  const price = Number(land.desiredPrice || 0).toLocaleString();

  const area = land.lndpclAr ?? land.area;

  const category = land.lndcgrCodeNm || land.lcCodeNm || "-";

  const updatedAt = land.lastUpdtDt || "-";

  return (
    <Panel>
      <CloseButton type="button" onClick={onClose} aria-label="상세 닫기">
        ×
      </CloseButton>

      <PanelBody>
        <div>
          {land.landImagePath ? (
            <LandImage src={land.landImagePath} alt="토지 이미지" />
          ) : (
            <ImagePlaceholder />
          )}

          <StatusBadges>
            <StatusBadge $variant="sale">매매 중</StatusBadge>
            <StatusBadge $variant="zone">ZONED</StatusBadge>
          </StatusBadges>
        </div>

        <Section>
          <Label>주소 (ADDRESS)</Label>
          <Value>{address || "-"}</Value>
        </Section>

        <InfoGrid>
          <div>
            <Label>금액 (PRICE)</Label>
            <Value>{price}원</Value>
          </div>

          <div>
            <Label>면적 (AREA)</Label>
            <Value>{area ? `${area}㎡` : "-"}</Value>
          </div>
        </InfoGrid>

        <Divider />

        <Section>
          <Label>상세 명세 (SPECIFICATIONS)</Label>

          <DetailGrid>
            <DetailItem>
              <Label>지목</Label>
              <Value>{category}</Value>
            </DetailItem>

            <DetailItem>
              <Label>등록대장 종류</Label>
              <Value>{land.regstrSeCodeNm || "-"}</Value>
            </DetailItem>

            <DetailItem>
              <Label>PNU (고유번호)</Label>
              <Value>{land.pnu || "-"}</Value>
            </DetailItem>

            <DetailItem>
              <Label>공유인 수</Label>
              <Value>
                {land.cnrsPsnCo !== undefined && land.cnrsPsnCo !== null
                  ? `${land.cnrsPsnCo}명${
                      Number(land.cnrsPsnCo) === 1 ? " (단독소유)" : ""
                    }`
                  : "-"}
              </Value>
            </DetailItem>
          </DetailGrid>
        </Section>

        <Divider />

        <Section>
          <Label>설명 (DESCRIPTION)</Label>
          <Description>
            {land.description || "등록된 설명이 없습니다."}
          </Description>
        </Section>

        <UpdatedAt>최신 수정일: {updatedAt}</UpdatedAt>
      </PanelBody>

      <ActionBar>
        <ContactButton type="button">담당자에게 문의하기</ContactButton>
        <BookmarkButton type="button">관심등록</BookmarkButton>
      </ActionBar>
    </Panel>
  );
}

export default SpecificLand;
