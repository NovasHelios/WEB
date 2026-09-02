// 대표 이미지 변경 상태를 관리하기 위한 React 훅입니다.
import { useEffect, useState } from "react";

// 상세 패널에서 사용할 아이콘입니다.
import { Bot, Heart, Info, X } from "lucide-react";
// 상세 패널 디자인에 필요한 styled 컴포넌트입니다.
import {
  ActionBar,
  AiCard,
  AiGrid,
  AiMetric,
  BetaBadge,
  BookmarkButton,
  CloseButton,
  ContactButton,
  DetailHeader,
  DetailTitle,
  ImageCounter,
  ImagePlaceholder,
  InfoCard,
  InfoRow,
  InfoTitle,
  LandImage,
  Panel,
  PanelBody,
  PriceValue,
  SaveIconButton,
  SectionLabel,
  ThumbButton,
  ThumbnailGrid,
  ThumbnailImage,
} from "./Preview.styeld";

// API 서버 기본 주소를 안전하게 정리합니다.
const normalizeBaseUrl = (value) => {
  // 환경변수가 없으면 운영 서버 주소를 기본값으로 사용합니다.
  const rawValue = value || "https://www.helioss.site";

  // 이미 http로 시작하면 마지막 슬래시만 제거합니다.
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }

  // 프로토콜이 없으면 https를 붙입니다.
  return `https://${rawValue.replace(/\/$/, "")}`;
};

// 이미지 상대경로를 절대 URL로 바꾸기 위한 API 기본 주소입니다.
const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

// 서버에서 받은 이미지 경로를 실제 img src로 사용할 수 있게 변환합니다.
const resolveImageUrl = (path) => {
  // 이미지 경로가 없으면 빈 값을 반환합니다.
  if (!path) return "";

  // 이미 완전한 URL이면 그대로 사용합니다.
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // 루트 경로로 시작하면 API 서버 주소를 앞에 붙입니다.
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;

  // uploads 경로로 시작하면 API 서버 주소만 붙입니다.
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;

  // 파일명만 온 경우 토지 이미지 업로드 경로를 붙입니다.
  return `${API_BASE_URL}/uploads/lands/${path}`;
};

// 토지 이미지 경로가 없을 때 보여줄 임시 이미지 색상입니다.
const fallbackImages = ["#d8c09b", "#e8decf", "#d8dee5"];

// 숫자 값을 가격 표기로 변환합니다.
const formatPrice = (value) => {
  // 가격 값이 없으면 기본값을 보여줍니다.
  if (!value) return "4.5 억원";

  // 숫자로 변환 가능한 가격만 계산합니다.
  const numberValue = Number(value);

  // 숫자가 아니면 원본 값을 그대로 보여줍니다.
  if (Number.isNaN(numberValue)) return String(value);

  // 1억 이상이면 억 단위로 표시합니다.
  if (numberValue >= 100000000) {
    // 원 단위를 억 단위로 변환합니다.
    const eok = numberValue / 100000000;

    // 소수 첫째 자리까지 표시하되, .0이면 제거합니다.
    const formattedEok = Number.isInteger(eok) ? eok : eok.toFixed(1);

    // 억 단위 가격을 반환합니다.
    return `${formattedEok} 억원`;
  }

  // 1천만원 이상이면 천만원 단위로 표시합니다.
  if (numberValue >= 10000000) {
    // 원 단위를 천만원 단위로 변환합니다.
    const cheonman = numberValue / 10000000;

    // 소수 첫째 자리까지 표시하되, .0이면 제거합니다.
    const formattedCheonman = Number.isInteger(cheonman)
      ? cheonman
      : cheonman.toFixed(1);

    // 천만원 단위 가격을 반환합니다.
    return `${formattedCheonman} 천만원`;
  }

  // 천만원 미만은 만원 단위로 표시합니다.
  const manwon = Math.round(numberValue / 10000);

  // 만원 단위 가격을 반환합니다.
  return `${manwon.toLocaleString()} 만원`;
};

// 숫자 값을 면적 표기로 변환합니다.
const formatArea = (value) => {
  // 면적 값이 없으면 기본값을 보여줍니다.
  if (!value) return "15,000 ㎡ (약 4,537평)";

  // 숫자로 변환 가능한 면적만 계산합니다.
  const numberValue = Number(value);

  // 숫자가 아니면 원본 값을 그대로 보여줍니다.
  if (Number.isNaN(numberValue)) return String(value);

  // 평 단위 값을 계산합니다.
  const pyeong = Math.round(numberValue / 3.3058).toLocaleString();

  // 제곱미터와 평을 함께 보여줍니다.
  return `${numberValue.toLocaleString()} ㎡ (약 ${pyeong}평)`;
};

// 마커 클릭 시 오른쪽에 뜨는 미리보기 패널입니다.
function Preview({ land, onClose, onOpenSpecific }) {
  // 현재 선택된 대표 이미지 번호를 저장합니다.
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 다른 토지를 클릭했을 때 첫 번째 이미지로 다시 초기화합니다.
  useEffect(() => {
    // 새 토지 상세을 열면 첫 번째 이미지를 대표 이미지로 보여줍니다.
    setSelectedImageIndex(0);
  }, [land?.id]);

  // 선택된 토지가 없으면 상세 패널을 렌더링하지 않습니다.
  if (!land) return null;

  // 상세 패널 상단에 표시할 주소입니다.
  const address = land.address || "토지 주소";

  // 서버에서 받은 이미지 경로 목록을 구성합니다.
  const rawImageList =
    land.landImagePaths ||
    land.imagePaths ||
    land.images ||
    land.imageUrls ||
    [];

  // 단일 이미지와 여러 이미지 배열을 하나의 배열로 합칩니다.
  const landImages = [
    land.landImagePath,
    ...(Array.isArray(rawImageList) ? rawImageList : []),
  ]
    // 비어 있는 이미지 경로를 제거합니다.
    .filter(Boolean)
    // 상대경로 이미지를 실제 접근 가능한 URL로 변환합니다.
    .map(resolveImageUrl);

  // 실제 이미지가 있으면 이미지 썸네일을 만들고, 없으면 임시 색상 썸네일을 사용합니다.
  const detailImages = landImages.length
    ? landImages.map((src) => ({ type: "image", src }))
    : fallbackImages.map((color) => ({ type: "placeholder", color }));

  // 지목 또는 용도 정보를 서버 필드 기준으로 표시합니다.
  const category = land.lcCodeNm || land.regstrSeCodeNm || "정보 없음";

  // 거래 유형을 서버 필드 기준으로 표시합니다.
  const transactionType = land.transactionType || "매매";

  // 현재 대표 이미지로 보여줄 항목입니다.
  const selectedImage = detailImages[selectedImageIndex] || detailImages[0];

  return (
    // 마커 클릭 시 우측에 뜨는 상세 패널입니다.
    <Panel>
      {/* 패널 제목과 닫기 버튼 영역입니다. */}
      <DetailHeader>
        {/* 상세 정보 종류를 표시합니다. */}
        <SectionLabel>토지 상세 정보</SectionLabel>

        {/* 상세 패널을 닫는 버튼입니다. */}
        <CloseButton type="button" onClick={onClose} aria-label="상세 닫기">
          <X size={20} strokeWidth={2} />
        </CloseButton>
      </DetailHeader>

      {/* 상세 토지 주소 또는 제목입니다. */}
      <DetailTitle>{address}</DetailTitle>

      {/* 패널 본문은 스크롤로 내려가며 확인합니다. */}
      <PanelBody>
        {/* 대표 이미지 영역입니다. */}
        <div>
          {selectedImage?.type === "image" ? (
            // 선택된 실제 토지 이미지를 대표 이미지로 표시합니다.
            <LandImage
              src={selectedImage.src}
              alt="토지 이미지"
              onError={(event) => {
                // 이미지 로드에 실패하면 깨진 이미지 아이콘 대신 임시 배경을 보여줍니다.
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            // 선택된 임시 이미지 색상을 대표 이미지 영역에 표시합니다.
            <ImagePlaceholder style={{ background: selectedImage?.color }} />
          )}

          {/* 이미지 우측 상단 관심 버튼입니다. */}
          <SaveIconButton type="button" aria-label="관심 등록">
            <Heart size={18} fill="#8f8a78" strokeWidth={0} />
          </SaveIconButton>

          {/* 이미지 개수 표시입니다. */}
          <ImageCounter>
            ▣ {selectedImageIndex + 1}/{detailImages.length}
          </ImageCounter>
        </div>

        {/* 썸네일 이미지 목록입니다. */}
        <ThumbnailGrid>
          {detailImages.map((image, index) => (
            <ThumbButton
              key={`${image.type}-${image.src || image.color}-${index}`}
              type="button"
              $active={index === selectedImageIndex}
              onClick={() => {
                // 클릭한 썸네일을 대표 이미지로 변경합니다.
                setSelectedImageIndex(index);
              }}
            >
              {image.type === "image" ? (
                // 실제 이미지 썸네일을 표시합니다.
                <ThumbnailImage as="img" src={image.src} alt="토지 썸네일" />
              ) : (
                // 임시 색상 썸네일을 표시합니다.
                <ThumbnailImage style={{ background: image.color }} />
              )}
            </ThumbButton>
          ))}
        </ThumbnailGrid>

        {/* 기본 정보 카드입니다. */}
        <InfoCard>
          <InfoTitle>
            <Info size={18} strokeWidth={2.2} />
            기본 정보
          </InfoTitle>

          <InfoRow>
            <span>지목 / 용도</span>
            <strong>{category}</strong>
          </InfoRow>

          <InfoRow>
            <span>총 면적</span>
            <strong>{formatArea(land.area)}</strong>
          </InfoRow>

          <InfoRow>
            <span>거래 방식</span>
            <strong>{transactionType}</strong>
          </InfoRow>

          <InfoRow>
            <span>희망가</span>
            <PriceValue>{formatPrice(land.desiredPrice)}</PriceValue>
          </InfoRow>
        </InfoCard>

        {/* AI 사업성 분석 카드입니다. */}
        <AiCard>
          <InfoTitle>
            <Bot size={18} strokeWidth={2.2} />
            AI 사업성 분석
            <BetaBadge>BETA</BetaBadge>
          </InfoTitle>

          <AiGrid>
            <AiMetric>
              <span>예상 발전 용량</span>
              <strong>3.4 kW</strong>
            </AiMetric>

            <AiMetric>
              <span>일 평균 발전시간</span>
              <strong>3.8 시간</strong>
            </AiMetric>

            <AiMetric>
              <span>일사량</span>
              <strong>3.4 kW</strong>
            </AiMetric>

            <AiMetric>
              <span>예상 설치 용량</span>
              <strong>?</strong>
            </AiMetric>
          </AiGrid>
        </AiCard>
      </PanelBody>

      {/* 하단 고정 액션 버튼 영역입니다. */}
      <ActionBar>
        <BookmarkButton type="button">
          <Heart size={20} strokeWidth={1.6} />
          관심 등록
        </BookmarkButton>

        {/* 상세보기 팝업을 여는 버튼입니다. */}
        <ContactButton type="button" onClick={onOpenSpecific}>
          상세 보기
        </ContactButton>

        <ContactButton type="button">채팅 하기</ContactButton>
      </ActionBar>
    </Panel>
  );
}

export default Preview;
