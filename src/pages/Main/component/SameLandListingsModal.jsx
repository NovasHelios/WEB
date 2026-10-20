import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { formatKoreanMoneyFromManwon } from "@/utils/priceFormat";
import { formatLandDate } from "@/utils/landList";
import {
  ListingsBackdrop,
  ListingsDialog,
  ListingsHeader,
  ListingsCloseButton,
  ListingsTitle,
  ListingsSubtitle,
  ParcelSummary,
  ListingFilters,
  ListingFilter,
  ListingCards,
  ListingCard,
  ListingType,
  ListingPrice,
  ListingMeta,
  ListingDetailButton,
  ListingsFooter,
} from "./SameLandListingsModal.styled";

const FILTERS = [
  { label: "전체", value: "ALL" },
  { label: "매매", value: "SALE" },
  { label: "임대", value: "LEASE" },
  { label: "사업 희망", value: "BUSINESS_HOPE" },
];

const getTransactionType = (land) => {
  const value = String(land.transactionType || "").toUpperCase();
  if (value === "LEASE" || value === "RENT" || value === "MONTHLY_RENT") return "LEASE";
  if (value === "BUSINESS_HOPE" || value.includes("HOPE")) return "BUSINESS_HOPE";
  return "SALE";
};

const getRegistrantName = (land) => {
  const rawName = land.ownerName || land.registrantName || land.userName || land.writerName || land.user?.name;
  if (!rawName) return "등록자 정보 없음";
  const name = Array.from(String(rawName).trim());
  return name.length < 2 ? `${name[0] || "등록자"}○` : `${name[0]}${"○".repeat(Math.min(name.length - 1, 3))}`;
};

const getRegistrationDate = (land) => formatLandDate(
  land.createdAt || land.createdDate || land.registeredAt || land.registerDate,
);

// 같은 필지의 등록별 거래 조건을 비교하고 상세 정보를 선택합니다.
export default function SameLandListingsModal({ lands, selectedId, onClose, onSelectListing }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const firstLand = lands[0] || {};

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const counts = useMemo(() => lands.reduce((result, land) => {
    result.ALL += 1;
    result[getTransactionType(land)] += 1;
    return result;
  }, { ALL: 0, SALE: 0, LEASE: 0, BUSINESS_HOPE: 0 }), [lands]);

  const visibleLands = useMemo(() => lands.filter((land) => (
    activeFilter === "ALL" || getTransactionType(land) === activeFilter
  )), [activeFilter, lands]);

  return (
    <ListingsBackdrop onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <ListingsDialog role="dialog" aria-modal="true" aria-labelledby="same-land-title">
        <ListingsHeader>
          <div>
            <ListingsTitle id="same-land-title">같은 토지의 등록 내용</ListingsTitle>
            <ListingsSubtitle>필지 정보는 하나로, 등록 조건은 등록자별로 보여줘요.</ListingsSubtitle>
          </div>
          <ListingsCloseButton type="button" onClick={onClose} aria-label="닫기">
            <X size={22} aria-hidden="true" />
          </ListingsCloseButton>
        </ListingsHeader>

        <ParcelSummary>
          <strong>{firstLand.address || "주소 정보 없음"}</strong>
          <span>{firstLand.area !== null && firstLand.area !== undefined && firstLand.area !== "" && Number.isFinite(Number(firstLand.area)) ? `${Number(firstLand.area).toLocaleString("ko-KR")}㎡` : "면적 정보 없음"} · 등록 {lands.length}건</span>
          <small>등록 희망가 기준</small>
        </ParcelSummary>

        <ListingFilters aria-label="거래 방식 필터">
          {FILTERS.map((filter) => (
            <ListingFilter
              key={filter.value}
              type="button"
              $active={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label} {counts[filter.value]}
            </ListingFilter>
          ))}
        </ListingFilters>

        <ListingCards>
          {visibleLands.map((land) => {
            const id = land.id ?? land.landId;
            const type = getTransactionType(land);
            const typeLabel = type === "LEASE" ? "임대" : type === "BUSINESS_HOPE" ? "사업 희망" : "매매";
            const price = type === "BUSINESS_HOPE"
              ? "조건 협의"
              : formatKoreanMoneyFromManwon(land.desiredPrice, "가격 협의");

            return (
              <ListingCard key={id} $selected={String(id) === String(selectedId)}>
                <ListingType>{typeLabel} · {getRegistrantName(land)}</ListingType>
                <ListingPrice>{price}</ListingPrice>
                <ListingMeta>{type === "LEASE" ? "보증금 별도" : "등록 희망가"} · {getRegistrationDate(land)}</ListingMeta>
                <ListingDetailButton type="button" $selected={String(id) === String(selectedId)} onClick={() => onSelectListing(land)}>
                  이 등록 상세보기
                </ListingDetailButton>
              </ListingCard>
            );
          })}
        </ListingCards>

        <ListingsFooter>등록 카드를 선택하면 해당 등록의 상세 정보를 확인할 수 있어요.</ListingsFooter>
      </ListingsDialog>
    </ListingsBackdrop>
  );
}
