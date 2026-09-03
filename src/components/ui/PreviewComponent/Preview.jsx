// 대표 이미지 변경 상태를 관리하기 위한 React 훅입니다.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 상세 패널에서 사용할 아이콘입니다.
import { Bot, Heart, Info, X } from "lucide-react";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import { formatKoreanMoneyFromManwon } from "@/utils/priceFormat";
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
  ImageBox,
  ImageArea,
  PlaceholderBackground,
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
  // 상세 패널 가격은 서버 기준인 만원 단위로 표시합니다.
  return formatKoreanMoneyFromManwon(value, "가격 없음");
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
  const navigate = useNavigate();
  // 현재 선택된 대표 이미지 번호를 저장합니다.
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // 현재 토지의 찜 등록 여부입니다.
  const [isWished, setIsWished] = useState(false);
  // 찜 요청 중 중복 클릭을 막기 위한 상태입니다.
  const [isWishLoading, setIsWishLoading] = useState(false);
  // 찜 요청 실패 메시지입니다.
  const [wishError, setWishError] = useState("");
  // 채팅방 생성 요청 중 중복 클릭을 막기 위한 상태입니다.
  const [isChatLoading, setIsChatLoading] = useState(false);
  // 채팅방 생성 결과 메시지입니다.
  const [chatMessage, setChatMessage] = useState("");

  // 서버 응답마다 id 필드명이 다를 수 있어 토지 ID를 한 번 정리합니다.
  const landId = land?.id ?? land?.landId;

  // 다른 토지를 클릭했을 때 첫 번째 이미지로 다시 초기화합니다.
  useEffect(() => {
    // 새 토지 상세을 열면 첫 번째 이미지를 대표 이미지로 보여줍니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedImageIndex(0);
  }, [landId]);

  useEffect(() => {
    let ignore = false;

    const syncWishStatus = async () => {
      // 로그인 전이거나 토지 ID가 없으면 찜 상태를 확인하지 않습니다.
      if (!landId || !getValidAccessToken()) {
        setIsWished(false);
        return;
      }

      try {
        const response = await authFetch(Api.Wishes, { method: "GET" });
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await response.json() : null;

        if (!response.ok || ignore) return;

        const wishes = Array.isArray(data?.data) ? data.data : [];
        setIsWished(wishes.some((wish) => String(wish.landId) === String(landId)));
      } catch {
        // 찜 상태 조회 실패는 상세 패널 사용을 막지 않습니다.
        if (!ignore) setIsWished(false);
      }
    };

    // 토지를 바꿀 때 현재 토지가 이미 찜되어 있는지 확인합니다.
    void syncWishStatus();

    return () => {
      ignore = true;
    };
  }, [landId]);

  const handleToggleWish = async () => {
    // 비로그인 사용자는 로그인 페이지로 이동시킵니다.
    if (!getValidAccessToken()) {
      navigate("/login");
      return;
    }

    if (!landId || isWishLoading) return;

    setIsWishLoading(true);
    setWishError("");
    setChatMessage("");

    try {
      const response = await authFetch(Api.Wish(landId), {
        method: isWished ? "DELETE" : "POST",
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "관심 토지 처리에 실패했습니다.");
      }

      setIsWished((prev) => !prev);
    } catch (error) {
      setWishError(error.message || "관심 토지 처리에 실패했습니다.");
    } finally {
      setIsWishLoading(false);
    }
  };

  const handleCreateChatRoom = async () => {
    // 비로그인 사용자는 채팅 요청 전에 로그인하도록 보냅니다.
    if (!getValidAccessToken()) {
      navigate("/login");
      return;
    }

    if (!landId || isChatLoading) return;

    setIsChatLoading(true);
    setWishError("");
    setChatMessage("");

    try {
      const response = await authFetch(Api.ChatRooms, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landId: Number(landId),
          initialMessage: `${address} 토지 상담을 요청합니다.`,
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "채팅방을 생성하지 못했습니다.");
      }

      setChatMessage("채팅 요청이 생성되었습니다.");
    } catch (error) {
      setChatMessage(error.message || "채팅방을 생성하지 못했습니다.");
    } finally {
      setIsChatLoading(false);
    }
  };

  // 선택된 토지가 없으면 상세 패널을 렌더링하지 않습니다.
  if (!land) return null;

  // 상세 패널 상단에 표시할 주소입니다.
  const address = land.address || "토지 주소";

  // 서버에서 받은 이미지 목록 필드를 하나의 배열로 정규화합니다.
  const imageList = Array.isArray(land.landImagePaths)
    ? land.landImagePaths
    : [
        land.landImagePath,
        land.landImagePaths,
        land.imagePaths,
        land.images,
        land.imageUrls,
      ].flat();

  // 실제로 사용할 수 있는 이미지 경로만 남기고 URL로 변환합니다.
  const landImages = imageList
    // 비어 있는 이미지 경로와 배열이 아닌 값을 제거합니다.
    .filter((path) => typeof path === "string" && path.trim())
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

  // 프리뷰에서 사용할 실제 이미지 목록입니다.
  const previewImageItems = detailImages.filter(
    (image) => image.type === "image"
  );

  // 프리뷰 대표 이미지는 선택된 실제 이미지 또는 첫 번째 실제 이미지입니다.
  const selectedImage =
    previewImageItems[selectedImageIndex] || previewImageItems[0];

  // 프리뷰 하단 썸네일은 최대 3개까지만 보여줍니다.
  const previewImages = previewImageItems.slice(0, 3);

  // 서버에서 받은 전체 실제 이미지 개수입니다.
  const totalImageCount = previewImageItems.length;

  // 프리뷰에서 숨긴 이미지가 있는지 확인합니다.
  const hasMoreImages = totalImageCount > previewImages.length;

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
        <ImageArea>
          <ImageBox>
            {/* placeholder를 먼저 배치해 이미지가 실패하면 보이도록 합니다. */}
            {selectedImage?.type === "placeholder" ? (
              <PlaceholderBackground
                style={{ background: selectedImage?.color }}
              />
            ) : (
              <PlaceholderBackground />
            )}

            {/* 선택된 실제 토지 이미지를 대표 이미지로 표시합니다. 실패 시 placeholder가 보입니다. */}
            {selectedImage?.type === "image" && (
              <LandImage
                src={selectedImage.src}
                alt="토지 이미지"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                style={{ position: "relative", zIndex: 2 }}
              />
            )}

            {/* 이미지 우측 상단 관심 버튼입니다. */}
            <SaveIconButton
              type="button"
              aria-label={isWished ? "관심 해제" : "관심 등록"}
              onClick={handleToggleWish}
              disabled={isWishLoading}
              $active={isWished}
            >
              <Heart
                size={18}
                fill="currentColor"
                strokeWidth={isWished ? 0 : 1.8}
              />
            </SaveIconButton>

            {/* 이미지 개수 표시입니다. */}
            <ImageCounter>
              ▣ {Math.min(selectedImageIndex + 1, totalImageCount)}/
              {totalImageCount}
            </ImageCounter>
          </ImageBox>
        </ImageArea>

        {/* 썸네일 이미지 목록입니다. */}
        <ThumbnailGrid>
          {previewImages.map((image, index) => (
            <ThumbButton
              key={`${image.src}-${index}`}
              type="button"
              $active={index === selectedImageIndex}
              onClick={() => {
                // 클릭한 썸네일을 대표 이미지로 변경합니다.
                setSelectedImageIndex(index);
              }}
            >
              {/* 실제 이미지 썸네일을 표시합니다. */}
              <ThumbnailImage as="img" src={image.src} alt="" />
            </ThumbButton>
          ))}

          {hasMoreImages && (
            <ThumbButton
              type="button"
              onClick={onOpenSpecific}
              aria-label="이미지 더보기"
            >
              +
            </ThumbButton>
          )}
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
            AI 사업성 분석 (임시 데이터입니다)
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
        {wishError ? <p>{wishError}</p> : null}
        {chatMessage ? <p>{chatMessage}</p> : null}

        <BookmarkButton
          type="button"
          onClick={handleToggleWish}
          disabled={isWishLoading}
          $active={isWished}
        >
          <Heart
            size={20}
            fill={isWished ? "currentColor" : "none"}
            strokeWidth={1.6}
          />
          {isWished ? "관심 해제" : "관심 등록"}
        </BookmarkButton>

        {/* 상세보기 팝업을 여는 버튼입니다. */}
        <ContactButton type="button" onClick={onOpenSpecific}>
          상세 보기
        </ContactButton>

        <ContactButton
          type="button"
          onClick={handleCreateChatRoom}
          disabled={isChatLoading}
        >
          {isChatLoading ? "요청 중..." : "채팅 하기"}
        </ContactButton>
      </ActionBar>
    </Panel>
  );
}

export default Preview;
