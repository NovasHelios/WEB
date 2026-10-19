import { useEffect, useMemo, useState } from "react";
import { Check, MoreVertical, X } from "lucide-react";
import { Api } from "@/contents/apiEndpoints";
import { authFetch } from "@/lib/auth";
import { extractLandArray, formatArea, formatDate, formatMoney, getTransactionLabel, normalizeBaseUrl, resolveImageUrl } from "@/pages/Land/landUtils";
import { readApiResponse } from "@/utils/apiResponse";
import {
  LandModalBackdrop, LandModal, LandModalHeader, LandModalTitle, LandModalSubtitle, LandModalClose,
  LandFilterList, LandFilter, LandModalList, LandOption, LandThumbnail, LandOptionBody, LandOptionTitle,
  LandOptionMeta, LandOptionDetails, LandOptionActions, LandChooseButton, LandModalFooter,
  LandModalError, LandModalEmpty, LandModalSubmit, LandModalLoading,
} from "./LandSelectionModal.styled";

const FILTERS = [
  { label: "전체", value: "ALL" },
  { label: "매매", value: "SALE" },
  { label: "임대", value: "LEASE" },
  { label: "사업 희망", value: "BUSINESS_HOPE" },
];

// 내 토지를 골라 사업자와 상담을 시작하는 선택 창입니다.
export default function LandSelectionModal({ business, onClose, onCreated }) {
  const [lands, setLands] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState([]);
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    // 창을 열 때 로그인 사용자의 토지 목록을 불러옵니다.
    let cancelled = false;
    void (async () => {
      try {
        const response = await authFetch(Api.MyLands);
        const payload = await readApiResponse(response, "등록한 토지 목록을 불러오지 못했습니다.");
        if (!cancelled) setLands(extractLandArray(payload)
          .filter((land) => land.id ?? land.landId)
          .map((land) => ({
            ...land,
            id: land.id ?? land.landId,
            address: land.address || "주소 정보 없음",
          })));
      } catch (err) {
        if (!cancelled) setError(err.message || "등록한 토지 목록을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // 모달 바깥 영역과 Escape 키로 선택 창을 닫을 수 있게 합니다.
    const closeOnEscape = (event) => { if (event.key === "Escape" && !submitting) onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, submitting]);

  const visibleLands = useMemo(() => lands.filter((land) => {
    if (filter === "ALL") return true;
    const transaction = String(land.transactionType || "").toUpperCase();
    return filter === "LEASE" ? transaction === "LEASE" || transaction === "RENT" : transaction === filter;
  }), [lands, filter]);

  const startChat = async () => {
    const land = lands.find((item) => String(item.id) === String(selectedId));
    if (!land) return;
    // 상세 응답에서 확인한 상대 플랜과 상담 활성 상태를 요청 직전에 다시 검증합니다.
    if (String(business.userPlan || "").toUpperCase() !== "BUSINESS" || !business.consultationAvailable) {
      setError("현재 플랜 또는 상담 설정으로는 채팅을 시작할 수 없습니다.");
      return;
    }
    // 응답에 사용자 ID가 없으면 기존처럼 프로필 ID로 요청해 서버 거절 사유를 확인합니다.
    const businessUserId = business.businessUserId ?? business.userId ?? business.user?.id ?? business.ownerId ?? business.id;
    setSubmitting(true);
    setError("");
    try {
      // 선택한 토지와 사업자에게 보낼 첫 상담 문구를 토지 소유자 API로 전달합니다.
      const response = await authFetch(Api.ChatRoomOwner(
        land.id,
        businessUserId,
        `${land.address} 토지로 상담 요청드립니다.`,
      ), {
        method: "POST",
      });
      if (!response.ok) {
        const responseBody = await response.clone().text();
        console.error("[사업자 채팅방 생성 실패]", { status: response.status, body: responseBody });
      }
      const payload = await readApiResponse(response, "채팅방을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
      const result = payload?.data ?? payload;
      const roomId = result?.roomId ?? result?.id;
      if (!roomId) throw new Error("채팅방 정보를 확인하지 못했습니다. 다시 시도해 주세요.");
      onCreated({ ...result, roomId, landId: result.landId ?? land.id });
    } catch (err) {
      setError(err.message || "채팅방을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LandModalBackdrop onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) onClose(); }}>
      <LandModal role="dialog" aria-modal="true" aria-labelledby="land-select-title">
        <LandModalHeader>
          <div>
            <LandModalTitle id="land-select-title">등록된 토지 선택</LandModalTitle>
            <LandModalSubtitle>상담을 시작할 토지를 선택해 주세요.</LandModalSubtitle>
          </div>
          <LandModalClose type="button" aria-label="닫기" onClick={onClose} disabled={submitting}><X size={21} /></LandModalClose>
        </LandModalHeader>

        <LandFilterList aria-label="거래 방식 필터">
          {FILTERS.map((item) => <LandFilter key={item.value} type="button" $active={filter === item.value} onClick={() => setFilter(item.value)}>{item.label} {item.value === "ALL" ? lands.length : lands.filter((land) => item.value === "LEASE" ? ["LEASE", "RENT"].includes(String(land.transactionType || "").toUpperCase()) : String(land.transactionType || "").toUpperCase() === item.value).length}</LandFilter>)}
        </LandFilterList>

        <LandModalList>
          {loading ? <LandModalLoading>등록한 토지를 불러오고 있어요.</LandModalLoading> : null}
          {!loading && visibleLands.length === 0 ? <LandModalEmpty>{lands.length ? "선택한 거래 방식의 토지가 없습니다." : "등록된 토지가 없습니다."}</LandModalEmpty> : null}
          {!loading && visibleLands.map((land) => {
            const imagePath = land.landImagePaths?.[0] || land.landImagePath || "";
            const imageUrl = resolveImageUrl(imagePath, baseUrl);
            const transactionLabel = getTransactionLabel(land.transactionType);
            const dateValue = land.createdAt || land.createdDate || land.registeredAt || "-";
            const isSelected = String(selectedId) === String(land.id);
            return <LandOption key={land.id} $selected={isSelected} onClick={() => setSelectedId(land.id)}>
              <LandThumbnail $hasImage={Boolean(imageUrl && !failedImages.includes(String(land.id)))}>
                {imageUrl && !failedImages.includes(String(land.id)) ? <img src={imageUrl} alt="" onError={() => setFailedImages((current) => [...current, String(land.id)])} /> : <span>토지</span>}
              </LandThumbnail>
              <LandOptionBody>
                <LandOptionTitle>{land.address}</LandOptionTitle>
                <LandOptionMeta>면적 {formatArea(land.area)}㎡{land.desiredArea ? ` · 희망 면적 ${formatArea(land.desiredArea)}㎡` : ""}{" | "}거래 방식 {transactionLabel}{" | "}등록일 {dateValue === "-" ? "-" : formatDate(dateValue)}</LandOptionMeta>
                <LandOptionDetails><span>희망 가격</span><strong>{land.desiredPrice ? formatMoney(land.desiredPrice) : "-"}</strong></LandOptionDetails>
              </LandOptionBody>
              <LandOptionActions>
                <LandChooseButton type="button" $selected={isSelected} onClick={(event) => { event.stopPropagation(); setSelectedId(land.id); }}>
                  {isSelected ? <><Check size={16} /> 선택됨</> : "선택"}
                </LandChooseButton>
                <MoreVertical size={17} aria-hidden="true" />
              </LandOptionActions>
            </LandOption>;
          })}
        </LandModalList>

        {error ? <LandModalError role="alert">{error}</LandModalError> : null}
        <LandModalFooter>
          <span>선택한 토지 <strong>{selectedId === null ? 0 : 1}개</strong></span>
          <div>
            <button type="button" onClick={onClose} disabled={submitting}>닫기</button>
            <LandModalSubmit type="button" onClick={startChat} disabled={selectedId === null || submitting}>
              {submitting ? "채팅방 만드는 중..." : "선택 완료"}
            </LandModalSubmit>
          </div>
        </LandModalFooter>
      </LandModal>
    </LandModalBackdrop>
  );
}
