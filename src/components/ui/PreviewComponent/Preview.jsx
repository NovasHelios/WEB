// 대표 이미지 변경 상태를 관리하기 위한 React 훅입니다.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 대표 이미지 위 관심 버튼에 사용할 아이콘입니다.
import { Heart } from "lucide-react";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import { formatKoreanMoneyFromManwon } from "@/utils/priceFormat";

// 컴포넌트 호출
import BasicInfo from "./components/BasicInfo";

// 새 미리보기 이미지 영역에 필요한 styled 컴포넌트입니다.
import {
  ActionBar,
  ActionButton,
  ActionMessage,
  ImageArea,
  ImageBox,
  ImageCounter,
  LandImage,
  Panel,
  PanelBody,
  PlaceholderBackground,
  SaveIconButton,
  TabButton,
  TabContent,
  TabList,
  TabPreparingMessage,
  TabSection,
  ThumbButton,
  ThumbnailGrid,
  ThumbnailImage,
  WishButton,
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

// 미리보기에서 이동할 수 있는 정보 탭 목록입니다.
const PREVIEW_TABS = [
  { id: "basic", label: "기본 정보" },
  { id: "solar", label: "태양광 적합도" },
  { id: "description", label: "상세 설명" },
];

// 숫자 값을 가격 표기로 변환합니다.
const formatPrice = (value) => {
  // 상세 패널 가격은 서버 기준인 원 단위로 표시합니다.
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
function Preview({ land, onClose }) {
  const navigate = useNavigate();
  // 현재 선택된 대표 이미지 번호를 저장합니다.
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // 현재 화면에 표시할 정보 탭을 저장합니다.
  const [activeTab, setActiveTab] = useState("basic");
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

    // 새 토지를 선택하면 기본 정보 탭부터 표시합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab("basic");
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

  // 프리뷰 대표 이미지는 선택된 이미지 또는 첫 번째 이미지입니다.
  const selectedImage =
    detailImages[selectedImageIndex] || detailImages[0];

  // 프리뷰 하단에는 실제 이미지 또는 placeholder를 최대 3개까지 보여줍니다.
  const previewImages = detailImages.slice(0, 3);

  // 서버에서 받은 전체 실제 이미지 개수입니다.
  const totalImageCount = landImages.length;

  // 실제 이미지가 없으면 이미지 카운터의 현재 번호를 0으로 표시합니다.
  const currentImageNumber = totalImageCount
    ? Math.min(selectedImageIndex + 1, totalImageCount)
    : 0;

  return (
    // 새 디자인을 단계적으로 구성할 미리보기 패널의 기본 틀입니다.
    <Panel>
      {/* 이미지와 이후 탭 콘텐츠가 들어갈 스크롤 영역입니다. */}
      <PanelBody>
        {/* 선택된 토지의 대표 이미지 영역입니다. */}
        <ImageArea>
          <ImageBox>
            {/* 이미지가 없거나 로드에 실패할 때 보여줄 배경입니다. */}
            <PlaceholderBackground
              $color={
                selectedImage?.type === "placeholder"
                  ? selectedImage.color
                  : undefined
              }
            />

            {/* 선택된 실제 이미지를 대표 이미지로 표시합니다. */}
            {selectedImage?.type === "image" && (
              <LandImage
                src={selectedImage.src}
                alt="선택한 토지의 대표 이미지"
                onError={(event) => {
                  // 이미지 로드에 실패하면 뒤에 배치된 placeholder를 보여줍니다.
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

            {/* 대표 이미지 우측 상단의 관심 등록 버튼입니다. */}
            <SaveIconButton
              type="button"
              aria-label={isWished ? "관심 해제" : "관심 등록"}
              onClick={handleToggleWish}
              disabled={isWishLoading}
              $active={isWished}
            >
              <Heart
                size={20}
                fill="currentColor"
                strokeWidth={isWished ? 0 : 1.8}
              />
            </SaveIconButton>

            {/* 현재 이미지 번호와 전체 이미지 개수를 표시합니다. */}
            <ImageCounter>
              ▣ {currentImageNumber}/{totalImageCount}
            </ImageCounter>
          </ImageBox>
        </ImageArea>

        {/* 대표 이미지를 변경할 수 있는 썸네일 목록입니다. */}
        <ThumbnailGrid>
          {previewImages.map((image, index) => (
            <ThumbButton
              key={image.src || `${image.color}-${index}`}
              type="button"
              $active={index === selectedImageIndex}
              onClick={() => {
                // 클릭한 썸네일의 번호를 대표 이미지 상태에 저장합니다.
                setSelectedImageIndex(index);
              }}
              aria-label={`${index + 1}번째 이미지 보기`}
            >
              {image.type === "image" ? (
                // 서버에서 받은 실제 이미지를 썸네일로 표시합니다.
                <ThumbnailImage src={image.src} alt="" />
              ) : (
                // 이미지가 없을 때 placeholder 색상을 썸네일에 표시합니다.
                <PlaceholderBackground as="span" $color={image.color} />
              )}
            </ThumbButton>
          ))}
        </ThumbnailGrid>
        {/* 세 정보 화면을 전환하는 탭 영역입니다. */}
        <TabSection>
          {/* 기본 정보, 태양광 적합도, 상세 설명 탭 버튼입니다. */}
          <TabList role="tablist" aria-label="토지 정보">
            {PREVIEW_TABS.map((tab) => (
              <TabButton
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                $active={activeTab === tab.id}
                onClick={() => {
                  // 클릭한 탭을 현재 선택된 탭으로 저장합니다.
                  setActiveTab(tab.id);
                }}
              >
                {tab.label}
              </TabButton>
            ))}
          </TabList>

          {/* 현재 선택된 탭의 내용을 표시합니다. */}
          <TabContent role="tabpanel">
            {activeTab === "basic" && (
              <BasicInfo
                land={land}
                address={address}
                category={category}
                transactionType={transactionType}
                formattedArea={formatArea(land.area)}
                formattedPrice={formatPrice(land.desiredPrice)}
              />
            )}

            {/* 아직 만들지 않은 두 탭에는 지원 예정 문구를 표시합니다. */}
            {activeTab !== "basic" && (
              <TabPreparingMessage>
                아직 지원하지 않는 기능입니다
              </TabPreparingMessage>
            )}
          </TabContent>
        </TabSection>
      </PanelBody>

      {/* 스크롤과 분리되어 패널 하단에 고정되는 버튼 영역입니다. */}
      <ActionBar>
        {/* 관심 등록 또는 채팅 요청 결과를 표시합니다. */}
        {(wishError || chatMessage) && (
          <ActionMessage $error={Boolean(wishError)}>
            {wishError || chatMessage}
          </ActionMessage>
        )}

        {/* 기존 관심 등록 기능을 실행합니다. */}
        <WishButton
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
        </WishButton>

        {/* 기존 채팅방 생성 기능을 실행합니다. */}
        <ActionButton
          type="button"
          onClick={handleCreateChatRoom}
          disabled={isChatLoading}
        >
          {isChatLoading ? "요청 중..." : "채팅 하기"}
        </ActionButton>
      </ActionBar>
    </Panel>
  );
}

export default Preview;
