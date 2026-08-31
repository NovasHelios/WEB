// 상세보기 팝업에서 사용할 아이콘입니다.
import {
  Bot,
  FileText,
  Heart,
  Image as ImageIcon,
  Info,
  MapPin,
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
  InfoGrid,
  InfoList,
  InfoRow,
  LocationCard,
  LocationMap,
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
} from "./Specific.styled";

// API 서버 기본 주소를 안전하게 정리합니다.
const normalizeBaseUrl = (value) => {
  // 환경변수가 없으면 운영 서버 주소를 기본값으로 사용합니다.
  const rawValue = value || "https://www.helioss.site";

  // 완전한 URL이면 마지막 슬래시만 제거합니다.
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }

  // 프로토콜이 없는 주소에는 https를 붙입니다.
  return `https://${rawValue.replace(/\/$/, "")}`;
};

// 이미지와 파일 상대 경로를 절대 경로로 만들 때 사용할 서버 주소입니다.
const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

// 서버에서 받은 파일 경로를 브라우저에서 접근 가능한 URL로 변환합니다.
const resolveAssetUrl = (path) => {
  // 경로가 없으면 빈 값을 반환합니다.
  if (!path) return "";

  // 이미 완전한 URL이면 그대로 사용합니다.
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // 루트 상대 경로면 API 서버 주소를 앞에 붙입니다.
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;

  // 일반 상대 경로면 API 서버 주소와 함께 붙입니다.
  return `${API_BASE_URL}/${path}`;
};

// 원 단위 가격을 화면용 가격 문구로 변환합니다.
const formatPrice = (value) => {
  // 가격이 없으면 빈 값을 대신 표시합니다.
  if (value === null || value === undefined || value === "") return "-";

  // 숫자 계산을 위해 가격을 Number로 변환합니다.
  const numberValue = Number(value);

  // 숫자로 변환할 수 없으면 원본 값을 그대로 표시합니다.
  if (Number.isNaN(numberValue)) return String(value);

  // 1억 이상이면 억 단위로 표시합니다.
  if (numberValue >= 100000000) {
    // 원 단위를 억 단위로 바꿉니다.
    const eok = numberValue / 100000000;

    // 정수면 소수점을 숨기고, 소수면 첫째 자리까지 표시합니다.
    const formattedEok = Number.isInteger(eok) ? eok : eok.toFixed(1);

    // 억 단위 문구를 반환합니다.
    return `${formattedEok}억원`;
  }

  // 1천만원 이상이면 천만원 단위로 표시합니다.
  if (numberValue >= 10000000) {
    // 원 단위를 천만원 단위로 바꿉니다.
    const cheonman = numberValue / 10000000;

    // 정수면 소수점을 숨기고, 소수면 첫째 자리까지 표시합니다.
    const formattedCheonman = Number.isInteger(cheonman)
      ? cheonman
      : cheonman.toFixed(1);

    // 천만원 단위 문구를 반환합니다.
    return `${formattedCheonman}천만원`;
  }

  // 천만원 미만은 만원 단위로 표시합니다.
  return `${Math.round(numberValue / 10000).toLocaleString()}만원`;
};

// 제곱미터 면적을 평수와 함께 표시합니다.
const formatArea = (value) => {
  // 면적이 없으면 빈 값을 대신 표시합니다.
  if (value === null || value === undefined || value === "") return "-";

  // 숫자 계산을 위해 면적을 Number로 변환합니다.
  const numberValue = Number(value);

  // 숫자로 변환할 수 없으면 원본 값을 그대로 표시합니다.
  if (Number.isNaN(numberValue)) return String(value);

  // 평 단위 면적을 계산합니다.
  const pyeong = Math.round(numberValue / 3.3058);

  // 제곱미터와 평수를 함께 반환합니다.
  return `${numberValue.toLocaleString()} ㎡ (${pyeong.toLocaleString()}평)`;
};

// 거래 유형 코드를 한국어 화면 문구로 변환합니다.
const formatTransactionType = (value) => {
  // 서버 거래 유형 코드를 화면 문구로 매핑합니다.
  const transactionMap = {
    SALE: "매매",
    LEASE: "임대",
    BUSINESS_HOPE: "사업희망",
  };

  // 매핑된 값이 없으면 원본 값을 사용합니다.
  return transactionMap[value] || value || "-";
};

// 상세보기에서 사용할 이미지 목록을 구성합니다.
const buildImageList = (land) => {
  // 서버에서 여러 이미지 배열을 줄 가능성을 대비합니다.
  const extraImages =
    land.landImagePaths || land.imagePaths || land.images || land.imageUrls || [];

  // 대표 이미지와 추가 이미지를 하나의 배열로 합칩니다.
  return [land.landImagePath, ...(Array.isArray(extraImages) ? extraImages : [])]
    .filter(Boolean)
    .map(resolveAssetUrl);
};

// 상세보기에서 사용할 문서 목록을 구성합니다.
const buildDocumentList = (land) => {
  // 서버에서 단일 문서 경로만 주는 현재 구조를 배열로 맞춥니다.
  const documents = [land.documentPath].filter(Boolean);

  // 문서 카드에서 사용할 이름과 URL을 만듭니다.
  return documents.map((path, index) => ({
    name: path.split("/").pop() || `토지 서류 ${index + 1}`,
    url: resolveAssetUrl(path),
  }));
};

// 상세보기 팝업 컴포넌트입니다.
function Specific({ land, onClose }) {
  // 선택된 토지가 없으면 팝업을 보여주지 않습니다.
  if (!land) return null;

  // 서버 상세 정보의 주소를 제목으로 사용합니다.
  const address = land.address || land.ldCodeNm || "토지 주소";

  // 서버 이미지 경로를 화면 이미지 목록으로 변환합니다.
  const images = buildImageList(land);

  // 서버 문서 경로를 문서 카드 목록으로 변환합니다.
  const documents = buildDocumentList(land);

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
                  <HeroImage src={images[0]} alt="토지 대표 이미지" />
                ) : (
                  // 이미지가 없으면 임시 이미지 박스를 표시합니다.
                  <ImagePlaceholder>
                    <ImageIcon size={34} strokeWidth={1.5} />
                  </ImagePlaceholder>
                )}

                {/* 이미지 개수 표시입니다. */}
                <ImageCounter>▣ 1/{Math.max(images.length, 1)}</ImageCounter>
              </HeroImageBox>

              {/* 썸네일 영역입니다. */}
              <ThumbRow>
                {(images.length ? images : ["", "", ""])
                  .slice(0, 4)
                  .map((src, index) => (
                    <ThumbButton
                      key={`${src || "empty"}-${index}`}
                      $active={index === 0}
                    >
                      {src ? (
                        // 실제 이미지 썸네일입니다.
                        <ThumbImage
                          src={src}
                          alt={`토지 썸네일 ${index + 1}`}
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
              <LocationMap>
                <MapPin size={24} fill="#18a05e" color="#18a05e" />
                <span>Map View</span>
              </LocationMap>
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

            <AnalysisCard>
              <SectionTitle>
                <Bot size={18} strokeWidth={2} />
                태양광 적합도 분석
                <ScoreBadge>86점 / 100점</ScoreBadge>
              </SectionTitle>

              <AnalysisGrid>
                <AnalysisItem>
                  <span>일사량</span>
                  <strong>89점</strong>
                </AnalysisItem>
                <AnalysisItem>
                  <span>경사도</span>
                  <strong>78점</strong>
                </AnalysisItem>
                <AnalysisItem>
                  <span>전력 인입 용이성</span>
                  <strong>85점</strong>
                </AnalysisItem>
                <AnalysisItem>
                  <span>도로 접근성</span>
                  <strong>90점</strong>
                </AnalysisItem>
                <AnalysisItem>
                  <span>인허가 가능성</span>
                  <strong>92점</strong>
                </AnalysisItem>
              </AnalysisGrid>
            </AnalysisCard>
          </InfoGrid>

          {/* AI 의견 영역입니다. */}
          <AiOpinion>
            <SectionTitle>AI 의견</SectionTitle>
            <p>{land.description || "등록된 설명이 없습니다."}</p>
          </AiOpinion>
        </MainContent>
      </Panel>
    </SpecificBackdrop>
  );
}

// 다른 파일에서 사용할 수 있도록 내보냅니다.
export default Specific;
