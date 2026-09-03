import {useState, useEffect} from "react";
// 상세보기 팝업에서 사용할 아이콘입니다.
import {
  Bot,
  FileText,
  Image as ImageIcon,
  Info,
  X,
} from "lucide-react";
// 상세보기 팝업 스타일 컴포넌트를 가져옵니다.
import {
  AiOpinion,
  AnalysisCard,
  AnalysisGrid,
  AnalysisItem,
  CloseButton,
  DetailGrid,
  DocumentCard,
  DocumentGrid,
  DocumentIconBox,
  DocumentSection,
  Header,
  HeroImage,
  HeroImageBox,
  ImageCounter,
  ImagePlaceholder,
  InfoCard,
  InfoColumn,
  InfoGrid,
  InfoList,
  InfoRow,
  LocationCard,
  LocationTitle,
  MainContent,
  MetaTable,
  Panel,
  PhotoColumn,
  ScoreBadge,
  SectionTitle,
  SpecificBackdrop,
  Tag,
  TagRow,
  ThumbButton,
  ThumbImage,
  ThumbRow,
  Title,
  UnsupportedText,
} from "./Specific.styled";
import SpecificMiniMap from "./SpecificMiniMap";
import {
  buildDocumentList,
  buildImageList,
  formatArea,
  formatPrice,
  formatTransactionType,
} from "./specificFormatters";
// 상세보기 팝업의 블러 영역 안에서 AI 채팅을 사용합니다.
import AiChat from "@/components/ui/AiChat/AiChat";

// 아직 서버/API 연동이 되지 않은 값에 표시할 공통 문구입니다.
const UNSUPPORTED_TEXT = "아직 지원하지 않는 기능입니다";

// 태양광 적합도 분석에서 임시로 표시할 항목 점수입니다.
const solarAnalysisItems = [
  { label: "일사량", score: 89 },
  { label: "경사도", score: 78 },
  { label: "전력 인입 용이성", score: 85 },
  { label: "도로 접근성", score: 90 },
  { label: "인허가 가능성", score: 92 },
];

// 상세보기 팝업 컴포넌트입니다.
function Specific({ land, onClose }) {
  // 선택된 토지가 없으면 팝업을 보여주지 않습니다.
  if (!land) return null;

  // 서버 상세 정보의 주소를 제목으로 사용합니다.
  const address = land.address || land.ldCodeNm || "토지 주소";

  // 서버 이미지 경로를 화면 이미지 목록으로 변환합니다.
  const images = buildImageList(land);

  // 상세보기 팝업에서 실제 img src로 사용하는 이미지 주소를 확인합니다.
  console.log("상세보기 이미지 URL 목록:", images);

  // 서버 문서 경로를 문서 카드 목록으로 변환합니다.
  const documents = buildDocumentList(land);

  // 현재 대표 이미지로 보여줄 이미지 번호입니다.
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 다른 토지를 열면 첫 번째 이미지부터 보여줍니다.
  useEffect(() => {
    // 새 토지 상세보기로 바뀔 때 대표 이미지를 초기화합니다.
    setSelectedImageIndex(0);
  }, [land.id]);

  // 현재 선택된 대표 이미지 URL입니다.
  const selectedImage = images[selectedImageIndex] || images[0];

  return (
    // 팝업 뒤 배경을 덮고 블러 처리하는 영역입니다.
    <SpecificBackdrop>
      {/* 실제 상세보기 팝업 박스입니다. */}
      <Panel>
        {/* 팝업 상단 제목과 닫기 버튼 영역입니다. */}
        <Header>
          {/* 공개 상태 배지입니다. */}
          <Tag $soft>{land.status || "상태 정보 없음"}</Tag>

          {/* 팝업 닫기 버튼입니다. */}
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            <X size={24} strokeWidth={1.8} />
          </CloseButton>

          {/* 상세 토지 주소 제목입니다. */}
          <Title>{address}</Title>

          {/* 서버 필드 기반 토지 태그입니다. */}
          <TagRow>
            <Tag>{land.lcCodeNm || "지목 정보 없음"}</Tag>
            <Tag>{land.regstrSeCodeNm || "대장 정보 없음"}</Tag>
            <Tag>{land.ldCodeNm || "지역 정보 없음"}</Tag>
          </TagRow>
        </Header>

        {/* 상세보기 본문 스크롤 영역입니다. */}
        <MainContent>
          {/* 상단 이미지, 거래 정보, 위치 요약 영역입니다. */}
          <DetailGrid>
            {/* 토지 사진 영역입니다. */}
            <PhotoColumn>
              <HeroImageBox>
                {images[0] ? (
                  // 서버에서 받은 대표 이미지를 표시합니다.
                  <HeroImage src={selectedImage} alt="토지 대표 이미지" />
                ) : (
                  // 이미지가 없으면 임시 이미지 박스를 표시합니다.
                  <ImagePlaceholder>
                    <ImageIcon size={34} strokeWidth={1.5} />
                  </ImagePlaceholder>
                )}

                {/* 이미지 개수 표시입니다. */}
                <ImageCounter>
                  ▣ {selectedImageIndex + 1}/{Math.max(images.length, 1)}
                </ImageCounter>
              </HeroImageBox>

              {/* 썸네일 영역입니다. */}
              <ThumbRow>
                {(images.length ? images : ["", "", ""])
                  .slice(0, 4)
                  .map((src, index) => (
                    <ThumbButton
                      key={`${src || "empty"}-${index}`}
                      type="button"
                      $active={index === selectedImageIndex}
                      onClick={() => {
                        // 클릭한 썸네일 이미지를 대표 이미지로 변경합니다.
                        setSelectedImageIndex(index);
                      }}
                    >
                      {src ? (
                        // 실제 이미지 썸네일입니다.
                        <ThumbImage
                          src={src}
                          alt={`토지 썸네일 ${index + 1}`}
                          onError={(event) => {
                            // 상세보기 썸네일 이미지 로드 실패 URL을 확인합니다.
                            console.log(
                              "상세보기 썸네일 로드 실패:",
                              event.currentTarget.src
                            );
                          }}
                        />
                      ) : (
                        // 이미지가 없을 때 표시하는 빈 썸네일입니다.
                        <ImageIcon size={20} strokeWidth={1.4} />
                      )}
                    </ThumbButton>
                  ))}
              </ThumbRow>
            </PhotoColumn>

            {/* 서버 상세 정보 요약 테이블입니다. */}
            <MetaTable>
              <InfoRow>
                <span>거래 방식</span>
                <strong>{formatTransactionType(land.transactionType)}</strong>
              </InfoRow>
              <InfoRow>
                <span>희망 가격</span>
                <strong>{formatPrice(land.desiredPrice)}</strong>
              </InfoRow>
              <InfoRow>
                <span>면적</span>
                <strong>{formatArea(land.area)}</strong>
              </InfoRow>
              <InfoRow>
                <span>지목</span>
                <strong>{land.lcCodeNm || "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>등록일</span>
                <strong>{land.lastUpdtDt || "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>주소</span>
                <strong>{address}</strong>
              </InfoRow>
              <InfoRow>
                <span>PNU</span>
                <strong>{land.pnu || "-"}</strong>
              </InfoRow>
            </MetaTable>

            {/* 위치 요약 카드입니다. */}
            <LocationCard>
              <SpecificMiniMap land={land} />
              <LocationTitle>위치</LocationTitle>
            </LocationCard>
          </DetailGrid>

          {/* 서류 및 파일 영역입니다. */}
          <DocumentSection>
            <SectionTitle>서류 및 파일</SectionTitle>

            <DocumentGrid>
              {(documents.length
                ? documents
                : [{ name: "등록된 파일 없음", url: "" }]
              ).map((document, index) => (
                <DocumentCard
                  key={`${document.name}-${index}`}
                  as={document.url ? "a" : "div"}
                  href={document.url || undefined}
                  target={document.url ? "_blank" : undefined}
                  rel={document.url ? "noreferrer" : undefined}
                >
                  <DocumentIconBox>
                    <FileText size={18} strokeWidth={1.8} />
                  </DocumentIconBox>
                  <div>
                    <strong>{document.name}</strong>
                    <span>{land.lastUpdtDt || "-"}</span>
                  </div>
                </DocumentCard>
              ))}
            </DocumentGrid>
          </DocumentSection>

          {/* 기본 정보와 분석 카드 영역입니다. */}
          <InfoGrid>
            <InfoColumn>
              <InfoCard>
                <SectionTitle>
                  <Info size={18} strokeWidth={2} />
                  기본 정보
                </SectionTitle>

                <InfoList>
                  <InfoRow>
                    <span>용도지역</span>
                    <strong>{land.ldCodeNm || "-"}</strong>
                  </InfoRow>
                  <InfoRow>
                    <span>도로 접면</span>
                    <strong>{land.regstrSeCodeNm || "-"}</strong>
                  </InfoRow>
                  <InfoRow>
                    <span>공유 인원</span>
                    <strong>{land.cnrsPsnCo || "-"}</strong>
                  </InfoRow>
                  <InfoRow>
                    <span>소유자</span>
                    <strong>{land.ownerEmail || "-"}</strong>
                  </InfoRow>
                </InfoList>
              </InfoCard>

              <InfoCard>
                <SectionTitle>예상 정보</SectionTitle>

                <InfoList>
                  <InfoRow>
                    <span>설치 용량</span>
                    <UnsupportedText>{UNSUPPORTED_TEXT}</UnsupportedText>
                  </InfoRow>
                  <InfoRow>
                    <span>발전량</span>
                    <UnsupportedText>{UNSUPPORTED_TEXT}</UnsupportedText>
                  </InfoRow>
                </InfoList>
              </InfoCard>
            </InfoColumn>

            <AnalysisCard>
              <SectionTitle>
                <Bot size={18} strokeWidth={2} />
                태양광 적합도 분석 (임시 데이터입니다.)
                <ScoreBadge>86점 / 100점</ScoreBadge>
              </SectionTitle>

              <AnalysisGrid>
                <AnalysisItem $score={86}>
                  <span>종합 적합도</span>
                  <strong>86점 / 100점</strong>
                </AnalysisItem>
                {solarAnalysisItems.map((item) => (
                  <AnalysisItem key={item.label} $score={item.score}>
                    <span>{item.label}</span>
                    <strong>{item.score}점</strong>
                  </AnalysisItem>
                ))}
              </AnalysisGrid>
            </AnalysisCard>
          </InfoGrid>

          {/* 판매자가 작성한 상세 설명 영역입니다. */}
          <AiOpinion>
            <SectionTitle>상세 설명</SectionTitle>
            <p>{land.description || "등록된 상세 설명이 없습니다."}</p>
          </AiOpinion>

          {/* AI 의견은 추후 기능 개발 전까지 준비 중 문구를 표시합니다. */}
          <AiOpinion>
            <SectionTitle>AI 의견</SectionTitle>
            <UnsupportedText>{UNSUPPORTED_TEXT}</UnsupportedText>
          </AiOpinion>
        </MainContent>
      </Panel>
    </SpecificBackdrop>
  );
}

// 다른 파일에서 사용할 수 있도록 내보냅니다.
export default Specific;
