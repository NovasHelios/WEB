// 검색 결과 카드의 이미지 오류 상태를 관리하기 위한 React 훅입니다.
import { useState } from "react";

// 검색 결과 카드의 이미지 대체 영역에 사용할 아이콘입니다.
import { ImageIcon } from "lucide-react";

// 검색 결과 패널에서 사용할 styled 컴포넌트입니다.
import {
  EmptyMessage,
  ResultAddress,
  ResultCard,
  ResultCardBody,
  ResultImage,
  ResultImageFallback,
  ResultImageWrap,
  ResultInfoRow,
  ResultList,
  ResultPrice,
  ResultPriceRow,
  SearchPreviewHeader,
  SearchPreviewPanel,
  SearchResultCount,
  SearchResultTitle,
  StatusMessage,
} from "./SearchPreview.styled";

// API 서버 기본 주소를 환경변수 또는 운영 주소에서 가져옵니다.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://api.helioss.site"
).replace(/\/$/, "");

// 서버 이미지 경로를 브라우저에서 사용할 절대 URL로 변환합니다.
const resolveImageUrl = (path) => {
  // 이미지 경로가 없으면 빈 문자열을 반환합니다.
  if (!path) return "";

  // 이미 완전한 URL이면 그대로 사용합니다.
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // 루트 상대경로는 API 서버 주소와 바로 연결합니다.
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;

  // uploads 경로는 중간 경로를 추가하지 않고 서버 주소에 연결합니다.
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;

  // 파일명만 전달된 경우 토지 이미지 기본 경로를 붙입니다.
  return `${API_BASE_URL}/uploads/lands/${path}`;
};

// 토지 데이터에서 검색 결과 카드에 사용할 첫 번째 이미지 경로를 찾습니다.
const getPrimaryImage = (land) => {
  // API별 이미지 필드 후보를 하나의 배열로 정리합니다.
  const imageCandidates = [
    land?.landImagePaths,
    land?.landImagePath,
    land?.imagePaths,
    land?.images,
    land?.imageUrls,
  ].flat(Infinity);

  // 사용할 수 있는 첫 번째 문자열 경로를 찾습니다.
  const firstImagePath = imageCandidates.find(
    (path) => typeof path === "string" && path.trim()
  );

  // 경로가 있으면 절대 URL로 변환하고, 없으면 빈 문자열을 반환합니다.
  return firstImagePath ? resolveImageUrl(firstImagePath) : "";
};

// 토지 면적을 제곱미터 형식으로 표시합니다.
const formatArea = (value) => {
  // 값이 없거나 숫자가 아니면 정보 없음으로 표시합니다.
  if (value === null || value === undefined || value === "") return "정보 없음";

  // 서버 값을 숫자로 변환합니다.
  const numericValue = Number(value);

  // 유효한 숫자가 아니면 정보 없음으로 표시합니다.
  if (!Number.isFinite(numericValue)) return "정보 없음";

  // 천 단위 구분 기호와 제곱미터 단위를 붙입니다.
  return `${Math.round(numericValue).toLocaleString("ko-KR")} ㎡`;
};

// 토지 희망 가격을 검색 카드에 맞는 짧은 형식으로 표시합니다.
const formatPrice = (value) => {
  // 값이 없거나 숫자가 아니면 정보 없음으로 표시합니다.
  if (value === null || value === undefined || value === "") return "정보 없음";

  // 서버 가격은 원 단위 숫자로 변환합니다.
  const numericValue = Number(value);

  // 유효한 숫자가 아니면 정보 없음으로 표시합니다.
  if (!Number.isFinite(numericValue)) return "정보 없음";

  // 1억원 이상은 카드 폭에 맞게 억 단위 한 자리 소수로 표시합니다.
  if (numericValue >= 100000000) {
    const eokValue = Number((numericValue / 100000000).toFixed(1));
    return `${eokValue.toLocaleString("ko-KR")}억`;
  }

  // 1만원 이상은 만원 단위로 표시합니다.
  if (numericValue >= 10000) {
    return `${Math.floor(numericValue / 10000).toLocaleString("ko-KR")}만원`;
  }

  // 그보다 작은 금액은 원 단위로 표시합니다.
  return `${numericValue.toLocaleString("ko-KR")}원`;
};

// 거래 유형에 따라 가격 행의 라벨을 결정합니다.
const getPriceLabel = (transactionType) => {
  // 임대 계열은 임대가로 표시합니다.
  if (transactionType === "LEASE" || transactionType === "MONTHLY_RENT") {
    return "임대가";
  }

  // 매매 계열은 매매가로 표시합니다.
  if (transactionType === "SALE") return "매매가";

  // 거래 유형이 없거나 다른 값이면 중립적인 문구를 사용합니다.
  return "희망 가격";
};

// 검색 결과 토지 한 건을 카드로 표시합니다.
function SearchResultCard({ land, isSelected, onSelect }) {
  // 대표 이미지 로드 실패 여부입니다.
  const [isImageFailed, setIsImageFailed] = useState(false);

  // 검색 결과 카드에 사용할 대표 이미지 URL입니다.
  const imageUrl = getPrimaryImage(land);

  return (
    // 카드 전체를 버튼으로 만들어 클릭 시 지도 이동을 실행합니다.
    <ResultCard
      type="button"
      $selected={isSelected}
      onClick={() => onSelect(land)}
      aria-label={`${land?.address || "주소 정보 없음"} 토지 위치로 이동`}
    >
      {/* 대표 이미지 또는 이미지 없음 상태를 표시합니다. */}
      <ResultImageWrap>
        {imageUrl && !isImageFailed ? (
          <ResultImage
            src={imageUrl}
            alt={`${land?.address || "검색 결과 토지"} 대표 이미지`}
            onError={() => setIsImageFailed(true)}
          />
        ) : (
          <ResultImageFallback>
            <ImageIcon size={32} strokeWidth={1.6} aria-hidden="true" />
          </ResultImageFallback>
        )}
      </ResultImageWrap>

      {/* 주소, 면적과 가격 정보를 표시합니다. */}
      <ResultCardBody>
        <ResultAddress>
          <span>{land?.address || "주소 정보 없음"}</span>
        </ResultAddress>

        <ResultInfoRow>
          <span>면적</span>
          <strong>{formatArea(land?.area)}</strong>
        </ResultInfoRow>

        {/* 현재 필터 응답에 예상 용량이 없으므로 가짜 값을 표시하지 않습니다. */}
        <ResultPriceRow>
          <span>{getPriceLabel(land?.transactionType)}</span>
          <ResultPrice>{formatPrice(land?.desiredPrice)}</ResultPrice>
        </ResultPriceRow>
      </ResultCardBody>
    </ResultCard>
  );
}

// 검색 지역 안에 등록된 토지 목록을 표시하는 왼쪽 패널입니다.
function SearchPreview({
  keyword,
  lands = [],
  isLoading,
  error,
  selectedLandId,
  onSelectLand,
}) {
  return (
    <SearchPreviewPanel aria-label="토지 검색 결과">
      {/* 검색 결과 제목과 조회 개수를 표시합니다. */}
      <SearchPreviewHeader>
        <SearchResultTitle>검색 결과</SearchResultTitle>
        <SearchResultCount>
          {keyword ? `${keyword} · ` : ""}
          {lands.length}건의 토지 발견
        </SearchResultCount>
      </SearchPreviewHeader>

      {/* 조회 중에는 기존 목록 대신 로딩 문구를 표시합니다. */}
      {isLoading && <StatusMessage>등록된 토지를 찾고 있습니다.</StatusMessage>}

      {/* 검색 요청이 실패하면 오류 문구를 표시합니다. */}
      {!isLoading && error && <StatusMessage $error>{error}</StatusMessage>}

      {/* 조회에 성공했지만 결과가 없으면 빈 결과 문구를 표시합니다. */}
      {!isLoading && !error && lands.length === 0 && (
        <EmptyMessage>이 지역에 등록된 토지가 없습니다.</EmptyMessage>
      )}

      {/* 검색 지역 안에서 조회된 토지 카드를 표시합니다. */}
      {!isLoading && !error && lands.length > 0 && (
        <ResultList>
          {lands.map((land, index) => {
            // API별 식별자 필드를 하나의 값으로 정리합니다.
            const landId = land?.id ?? land?.landId;

            return (
              <SearchResultCard
                key={landId ?? `${land?.address || "land"}-${index}`}
                land={land}
                isSelected={String(landId) === String(selectedLandId)}
                onSelect={onSelectLand}
              />
            );
          })}
        </ResultList>
      )}
    </SearchPreviewPanel>
  );
}

export default SearchPreview;
