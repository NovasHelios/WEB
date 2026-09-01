// 상세보기 팝업에서 사용할 닫기 아이콘입니다.
import { X } from "lucide-react";

// 상세보기 팝업 스타일 컴포넌트를 가져옵니다.
import {
  SpecificBackdrop,
  SpecificPanel,
  SpecificHeader,
  SpecificTitle,
  SpecificTagRow,
  SpecificTag,
  SpecificCloseButton,
  SpecificBody,
  SpecificSection,
  SpecificSectionTitle,
  SpecificDescription,
  SpecificHeroGrid,
  SpecificImage,
  SpecificImageBox,
  SpecificInfoCard,
  SpecificInfoGrid,
  SpecificLabel,
  SpecificSummaryCard,
  SpecificSummaryRow,
  SpecificValue,
} from "./Specific.styled";

const API_BASE_URL = "https://www.helioss.site";

const resolveImageUrl = (path) => {
  // 서버 이미지 경로를 브라우저에서 볼 수 있는 URL로 바꿉니다.
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  return `${API_BASE_URL}/uploads/lands/${path}`;
};

const formatPrice = (value) => {
  // 서버 가격은 만원 단위로 내려오므로 조/억/만원으로 표시합니다.
  if (value === null || value === undefined || value === "") return "-";
  const numeric = Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  const jo = Math.floor(numeric / 100000000);
  const restAfterJo = numeric % 100000000;
  const eok = Math.floor(restAfterJo / 10000);
  const man = restAfterJo % 10000;

  if (jo > 0) {
    const eokText = eok > 0 ? ` ${eok.toLocaleString()}억원` : "";
    const manText = man > 0 ? ` ${man.toLocaleString()}만원` : "";
    return `${jo.toLocaleString()}조${eokText}${manText}`;
  }
  if (eok > 0 && man > 0) return `${eok.toLocaleString()}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok.toLocaleString()}억원`;
  return `${numeric.toLocaleString()}만원`;
};

const formatArea = (value) => {
  // 면적은 제곱미터와 평을 함께 표시합니다.
  if (!value) return "-";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  const pyeong = Math.round(numeric / 3.3058).toLocaleString();
  return `${numeric.toLocaleString()}㎡ (${pyeong}평)`;
};

const getTransactionLabel = (value) => {
  // 거래 유형 enum을 한글 라벨로 바꿉니다.
  const upper = String(value || "").toUpperCase();
  if (upper === "LEASE" || upper === "RENT") return "임대";
  if (upper === "SALE") return "매매";
  return "-";
};

// 상세보기 팝업 컴포넌트입니다.
function Specific({ land, onClose }) {
  // 선택된 토지가 없으면 팝업을 보여주지 않습니다.
  if (!land) return null;

  // 상세보기 제목에 사용할 주소입니다.
  const address = land.address || land.ldCodeNm || "토지 주소";
  const imagePath = Array.isArray(land.landImagePaths)
    ? land.landImagePaths[0]
    : land.landImagePath;
  const imageUrl = resolveImageUrl(imagePath);
  const tags = [land.lcCodeNm, land.regionSido, land.regionSigungu].filter(Boolean);

  return (
    // 팝업 뒤 배경을 덮고 블러 처리하는 영역입니다.
    <SpecificBackdrop>
      {/* 실제 상세보기 팝업 박스입니다. */}
      <SpecificPanel>
        {/* 팝업 상단 제목 영역입니다. */}
        <SpecificHeader>

          {/* 닫기 버튼입니다. */}
          <SpecificCloseButton
            type="button"
            onClick={onClose}
            aria-label="상세보기 닫기"
          >
            <X size={24} strokeWidth={1.8} />
          </SpecificCloseButton>

          {/* 토지 주소 제목입니다. */}
          <SpecificTitle>{address}</SpecificTitle>

          {/* 토지 태그 영역입니다. */}
          <SpecificTagRow>
            {(tags.length ? tags : ["토지 정보"]).map((tag) => (
              <SpecificTag key={tag}>{tag}</SpecificTag>
            ))}
          </SpecificTagRow>
        </SpecificHeader>

        {/* 팝업 본문 영역입니다. */}
        <SpecificBody>
          {/* 상단 핵심 상세 정보 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>상단 상세 정보</SpecificSectionTitle>

            {/* 이미지와 핵심 거래 정보를 표시합니다. */}
            <SpecificHeroGrid>
              <SpecificImageBox>
                {imageUrl ? <SpecificImage src={imageUrl} alt={address} /> : null}
              </SpecificImageBox>
              <SpecificSummaryCard>
                <SpecificSummaryRow>
                  <SpecificLabel>거래 방식</SpecificLabel>
                  <SpecificValue>{getTransactionLabel(land.transactionType)}</SpecificValue>
                </SpecificSummaryRow>
                <SpecificSummaryRow>
                  <SpecificLabel>희망 가격</SpecificLabel>
                  <SpecificValue $highlight>{formatPrice(land.desiredPrice)}</SpecificValue>
                </SpecificSummaryRow>
                <SpecificSummaryRow>
                  <SpecificLabel>면적</SpecificLabel>
                  <SpecificValue>{formatArea(land.area)}</SpecificValue>
                </SpecificSummaryRow>
                <SpecificSummaryRow>
                  <SpecificLabel>등록 상태</SpecificLabel>
                  <SpecificValue>{land.status || "-"}</SpecificValue>
                </SpecificSummaryRow>
              </SpecificSummaryCard>
            </SpecificHeroGrid>
          </SpecificSection>

          {/* 서류 및 파일 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>서류 및 파일</SpecificSectionTitle>

            {/* 등록된 증명서 파일 상태를 표시합니다. */}
            <SpecificDescription>
              {land.documentPath ? `등록된 서류: ${land.documentPath}` : "등록된 서류가 없습니다."}
            </SpecificDescription>
          </SpecificSection>

          {/* 기본 정보와 분석 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>
              기본 정보 / 태양광 적합도 분석
            </SpecificSectionTitle>

            {/* VWorld와 자동 조회 결과를 카드로 표시합니다. */}
            <SpecificInfoGrid>
              <SpecificInfoCard>
                <SpecificLabel>PNU</SpecificLabel>
                <SpecificValue>{land.pnu || "-"}</SpecificValue>
              </SpecificInfoCard>
              <SpecificInfoCard>
                <SpecificLabel>지목</SpecificLabel>
                <SpecificValue>{land.lcCodeNm || land.regstrSeCodeNm || "-"}</SpecificValue>
              </SpecificInfoCard>
              <SpecificInfoCard>
                <SpecificLabel>공유인 수</SpecificLabel>
                <SpecificValue>{land.cnrsPsnCo || "-"}</SpecificValue>
              </SpecificInfoCard>
              <SpecificInfoCard>
                <SpecificLabel>법정동</SpecificLabel>
                <SpecificValue>{land.ldCodeNm || "-"}</SpecificValue>
              </SpecificInfoCard>
              <SpecificInfoCard>
                <SpecificLabel>좌표</SpecificLabel>
                <SpecificValue>{land.x && land.y ? `${land.y}, ${land.x}` : "-"}</SpecificValue>
              </SpecificInfoCard>
              <SpecificInfoCard>
                <SpecificLabel>최근 갱신일</SpecificLabel>
                <SpecificValue>{land.lastUpdtDt || "-"}</SpecificValue>
              </SpecificInfoCard>
            </SpecificInfoGrid>
          </SpecificSection>

          {/* AI 의견 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>상세 설명</SpecificSectionTitle>

            {/* 사용자가 입력한 상세 설명을 표시합니다. */}
            <SpecificDescription>
              {land.description || "등록된 상세 설명이 없습니다."}
            </SpecificDescription>
          </SpecificSection>
        </SpecificBody>
      </SpecificPanel>
    </SpecificBackdrop>
  );
}

// 다른 파일에서 사용할 수 있도록 내보냅니다.
export default Specific;
