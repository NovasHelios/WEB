import { ChevronDown, CalendarDays, Heart, MoreVertical, Plus, Shapes, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import Specific from "@/components/ui/SpecificPopUp/Specific";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import { formatKoreanMoneyFromManwon } from "@/utils/priceFormat";
import {
  SpaceActionButton,
  SpaceActionColumn,
  SpaceBadge,
  SpaceBadgeRow,
  SpaceCard,
  SpaceCardFooter,
  SpaceCardHeader,
  SpaceCardImage,
  SpaceCardMeta,
  SpaceCardMetaItem,
  SpaceCardMetaLabel,
  SpaceCardMetaValue,
  SpaceCardRow,
  SpaceContainer,
  SpaceFilterButton,
  SpaceFilterGroup,
  SpaceHeader,
  SpaceInfoRow,
  SpaceInner,
  SpaceMain,
  SpaceModal,
  SpaceModalActions,
  SpaceModalClose,
  SpaceModalError,
  SpaceModalField,
  SpaceModalHeader,
  SpaceModalInput,
  SpaceModalOverlay,
  SpaceModalSelect,
  SpaceModalTextarea,
  SpacePage,
  SpaceSortBar,
  SpaceStatText,
  SpaceTitle,
  SpaceTopAction,
  SpaceTopNote,
  SpaceTopRow,
  SpaceToolbar,
  SpaceWrapper,
} from "./MySpace.styles";

const normalizeBaseUrl = (value) => {
  const rawValue = value || "https://www.helioss.site";
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }

  return `https://${rawValue.replace(/\/$/, "")}`;
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  return `${API_BASE_URL}/uploads/lands/${path}`;
};

const formatPrice = (value) => {
  // 가격은 서버 기준인 만원 단위로 통일해서 표시합니다.
  return formatKoreanMoneyFromManwon(value);
};

const formatArea = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return Number.isInteger(value) ? value.toLocaleString("ko-KR") : String(value);
};

const formatDate = (value = new Date()) => {
  // 등록일은 서버 날짜가 있으면 사용하고, 없으면 오늘 날짜로 자동 표시합니다.
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

const getCreatedDate = (land) =>
  land.createdAt ||
  land.createdDate ||
  land.registeredAt ||
  land.registerDate ||
  land.created_at ||
  new Date();

const extractArray = (payload) => {
  // 서버 응답 구조가 바뀌어도 목록 배열만 안전하게 꺼냅니다.
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data,
    payload?.content,
    payload?.data?.content,
    payload?.result,
    payload?.data?.result,
  ];

  return candidates.find(Array.isArray) || [];
};

const getTransactionLabel = (value) => {
  const normalized = String(value || "").toUpperCase();
  if (normalized.includes("LEASE") || normalized.includes("RENT")) return "임대";
  if (normalized.includes("HOPE")) return "사업 희망";
  return "매매";
};

const normalizeLand = (land, index) => {
  // 서버 응답을 카드에서 쓰기 좋은 형태로 정리합니다.
  const transactionType = land.transactionType || land.status || "SALE";
  const landImage = land.landImagePath || land.imagePath || land.thumbnailPath || "";
  const rawPrice = land.desiredPrice ?? land.amount ?? land.price ?? null;
  const accentPool = [
    ["#cfe9a5", "#7fb96c"],
    ["#b9e0ff", "#79aedd"],
    ["#d9e5cf", "#a2b18b"],
    ["#f4d6b0", "#d8a85b"],
  ];

  return {
    id: land.landId ?? land.id ?? `${land.address ?? "land"}-${index}`,
    title: land.address ?? land.title ?? "-",
    type: land.lcCodeNm || land.regstrSeCodeNm || "전",
    region: land.useZone || land.lndpclAr || land.region || "지역 정보 없음",
    area: land.area ? `${formatArea(land.area)}㎡` : "-",
    date: formatDate(getCreatedDate(land)),
    tradeType: getTransactionLabel(transactionType),
    price: rawPrice ? formatPrice(rawPrice) : "-",
    likes: land.wishCount ?? land.favoriteCount ?? 0,
    accent: accentPool[index % accentPool.length],
    imageUrl: resolveImageUrl(landImage),
    raw: land,
  };
};

function MySpace() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체 상태");
  const [activeSort, setActiveSort] = useState("최신 등록순");
  const [lands, setLands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingLand, setEditingLand] = useState(null);
  const [editForm, setEditForm] = useState({
    address: "",
    desiredPrice: "",
    description: "",
    transactionType: "SALE",
  });
  const [editError, setEditError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState(null);

  const fetchMyLands = useCallback(async () => {
    // 로그인하지 않은 사용자는 내 공간을 볼 수 없으므로 로그인으로 보냅니다.
    if (!getValidAccessToken()) {
      navigate("/login");
      return;
    }

    // 서버에서 로그인한 사용자의 토지 목록만 가져옵니다.
    setIsLoading(true);
    setError("");

    try {
      const response = await authFetch(Api.MyLands, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }

        throw new Error(data?.message || data?.data?.message || "내 토지 목록을 불러오지 못했습니다.");
      }

      const list = extractArray(data);
      setLands(list.map(normalizeLand));
    } catch (err) {
      setError(err.message || "내 토지 목록을 불러오지 못했습니다.");
      setLands([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // 내 공간 페이지 진입 시 내가 등록한 토지를 조회합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMyLands();
  }, [fetchMyLands]);

  const filteredLands = useMemo(() => {
    if (activeFilter === "전체 상태") return lands;
    if (activeFilter === "등록 완료") return lands.filter((item) => item.raw?.status !== "REVIEW");
    if (activeFilter === "검토 중") return lands.filter((item) => item.raw?.status === "REVIEW");
    return lands;
  }, [activeFilter, lands]);

  const sortedLands = useMemo(() => {
    const next = [...filteredLands];

    if (activeSort === "최신 등록순") {
      return next.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }

    if (activeSort === "가격 높은 순") {
      return next.sort((a, b) => (Number(String(b.price).replace(/[^\d]/g, "")) || 0) - (Number(String(a.price).replace(/[^\d]/g, "")) || 0));
    }

    return next;
  }, [activeSort, filteredLands]);

  const totalCount = useMemo(() => lands.length, [lands]);

  const openEditModal = (land) => {
    // 선택한 토지 정보를 수정 폼에 채웁니다.
    setEditingLand(land);
    setEditForm({
      address: land.raw?.address || land.title || "",
      desiredPrice: land.raw?.desiredPrice ?? land.raw?.price ?? "",
      description: land.raw?.description || "",
      transactionType: land.raw?.transactionType || (land.tradeType === "임대" ? "LEASE" : "SALE"),
    });
    setEditError("");
  };

  const handleEditChange = (field) => (event) => {
    // 수정 입력값을 상태에 반영합니다.
    setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
    setEditError("");
  };

  const handleUpdateLand = async (event) => {
    event.preventDefault();

    if (!editingLand?.id || savingId) return;
    if (!editForm.address.trim()) {
      setEditError("주소를 입력해주세요.");
      return;
    }

    setSavingId(editingLand.id);
    setEditError("");

    try {
      // 내 토지 수정 요청을 서버에 보냅니다.
      const payload = {
        address: editForm.address.trim(),
        desiredPrice: editForm.desiredPrice
          ? Number(String(editForm.desiredPrice).replace(/[^\d]/g, ""))
          : null,
        description: editForm.description.trim(),
        transactionType: editForm.transactionType,
      };

      const response = await authFetch(Api.Land(editingLand.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "토지를 수정하지 못했습니다.");
      }

      const updatedLand = normalizeLand(data?.data || { ...editingLand.raw, ...payload }, 0);
      setLands((prev) =>
        prev.map((land) => (land.id === editingLand.id ? { ...updatedLand, accent: land.accent } : land))
      );
      setEditingLand(null);
    } catch (err) {
      setEditError(err.message || "토지를 수정하지 못했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteLand = async (land) => {
    if (!land?.id || deletingId) return;
    const confirmed = window.confirm("이 토지를 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeletingId(land.id);
    setError("");

    try {
      // 내 토지 삭제 요청을 서버에 보냅니다.
      const response = await authFetch(Api.Land(land.id), {
        method: "DELETE",
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "토지를 삭제하지 못했습니다.");
      }

      setLands((prev) => prev.filter((item) => item.id !== land.id));
    } catch (err) {
      setError(err.message || "토지를 삭제하지 못했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenDetail = async (land) => {
    if (!land?.id || detailLoadingId) return;

    setDetailLoadingId(land.id);
    setError("");

    try {
      // 내 공간 상세보기는 단일 토지 상세 API를 조회한 뒤 팝업으로 표시합니다.
      const response = await authFetch(Api.Land(land.id), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "토지 상세 정보를 불러오지 못했습니다.");
      }

      setSelectedLand(data?.data || land.raw || land);
    } catch (err) {
      setError(err.message || "토지 상세 정보를 불러오지 못했습니다.");
    } finally {
      setDetailLoadingId(null);
    }
  };

  return (
    <SpaceWrapper>
      {/* 상단 네비게이션 */}
      <div className="relative z-30">
        <NavBar
          onToggleSidebar={() => {}}
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSearch={() => navigate(`/land?keyword=${encodeURIComponent(keyword)}`)}
          isSuggestionOpen={false}
          regionSuggestions={[]}
        />
      </div>

      {/* 본문 영역 */}
      <SpaceMain>
        <SpacePage>
          <SpaceInner>
            <SpaceHeader>
              <div>
                <SpaceTitle>내 공간</SpaceTitle>
                <SpaceTopNote>내가 등록한 토지 목록과 현황을 확인할 수 있습니다.</SpaceTopNote>
              </div>

              <SpaceTopRow>
                <SpaceStatText>
                  총 <strong>{totalCount}</strong>건의 토지를 등록하셨습니다.
                </SpaceStatText>

                <SpaceTopAction type="button" onClick={() => navigate("/land/register")}>
                  <Plus size={18} strokeWidth={2.6} />
                  토지 등록하기
                </SpaceTopAction>
              </SpaceTopRow>
            </SpaceHeader>

            <SpaceToolbar>
              <SpaceFilterGroup>
                {/* 상태 필터 */}
                {["전체 상태", "등록 완료", "검토 중"].map((label) => (
                  <SpaceFilterButton
                    key={label}
                    type="button"
                    $active={activeFilter === label}
                    onClick={() => setActiveFilter(label)}
                  >
                    {label}
                    <ChevronDown size={16} strokeWidth={2.5} />
                  </SpaceFilterButton>
                ))}
              </SpaceFilterGroup>

              <SpaceSortBar>
                <SpaceStatText>
                  <strong>총 {totalCount}건</strong>
                </SpaceStatText>
                {/* 정렬 선택 */}
                <SpaceFilterButton
                  type="button"
                  $active={false}
                  onClick={() =>
                    setActiveSort((prev) =>
                      prev === "최신 등록순" ? "가격 높은 순" : "최신 등록순"
                    )
                  }
                >
                  {activeSort}
                  <ChevronDown size={16} strokeWidth={2.5} />
                </SpaceFilterButton>
              </SpaceSortBar>
            </SpaceToolbar>

            {isLoading ? (
              <div className="py-10 text-center text-sm font-semibold text-[#6f6658]">
                내 토지 목록을 불러오는 중입니다.
              </div>
            ) : null}

            {error ? (
              <div className="py-2 text-center text-sm font-semibold text-[#b42318]">
                {error}
              </div>
            ) : null}

            <SpaceContainer>
              {sortedLands.map((item) => (
                <SpaceCard key={item.id}>
                  <SpaceCardRow>
                    <SpaceCardImage $accent={item.accent}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      ) : null}
                      <span>{item.type}</span>
                    </SpaceCardImage>

                    <div className="flex flex-col flex-1 min-w-0 gap-4">
                      <SpaceCardHeader>
                        <div className="min-w-0">
                          <h3>{item.title}</h3>
                          <SpaceBadgeRow>
                            <SpaceBadge>{item.type}</SpaceBadge>
                            <SpaceBadge>{item.region}</SpaceBadge>
                          </SpaceBadgeRow>
                        </div>

                        <button type="button" aria-label="더보기" className="text-[#6d6a5f]">
                          <MoreVertical size={22} strokeWidth={2.4} />
                        </button>
                      </SpaceCardHeader>

                      <SpaceCardMeta>
                        <SpaceCardMetaItem>
                          <SpaceCardMetaLabel>
                            <Shapes size={14} strokeWidth={2.2} />
                            면적
                          </SpaceCardMetaLabel>
                          <SpaceCardMetaValue>{item.area}</SpaceCardMetaValue>
                        </SpaceCardMetaItem>

                        <SpaceCardMetaItem>
                          <SpaceCardMetaLabel>
                            <CalendarDays size={14} strokeWidth={2.2} />
                            등록일
                          </SpaceCardMetaLabel>
                          <SpaceCardMetaValue>{item.date}</SpaceCardMetaValue>
                        </SpaceCardMetaItem>
                      </SpaceCardMeta>

                      <SpaceInfoRow>
                        <div>
                          <SpaceCardMetaLabel>거래 방식</SpaceCardMetaLabel>
                          <SpaceCardMetaValue>{item.tradeType}</SpaceCardMetaValue>
                        </div>
                        <div>
        <SpaceCardMetaLabel>희망 가격</SpaceCardMetaLabel>
                          <SpaceCardMetaValue $highlight>{item.price}</SpaceCardMetaValue>
                        </div>
                      </SpaceInfoRow>

                      <SpaceCardFooter>
                        <span className="inline-flex items-center gap-1 text-[#6a6458]">
                          <Heart size={16} strokeWidth={2.2} />
                          {item.likes}
                        </span>
                      </SpaceCardFooter>
                    </div>

                    <SpaceActionColumn>
                      {/* 카드별 액션 버튼 */}
                      <SpaceActionButton type="button" onClick={() => handleOpenDetail(item)}>
                        {detailLoadingId === item.id ? "불러오는 중" : "토지 상세 보기"}
                      </SpaceActionButton>
                      <SpaceActionButton
                        type="button"
                        $secondary
                        onClick={() => openEditModal(item)}
                        disabled={savingId === item.id}
                      >
                        <SquarePen size={15} strokeWidth={2.4} />
                        수정
                      </SpaceActionButton>
                      <SpaceActionButton
                        type="button"
                        $danger
                        onClick={() => handleDeleteLand(item)}
                        disabled={deletingId === item.id}
                      >
                        <Trash2 size={15} strokeWidth={2.4} />
                        {deletingId === item.id ? "삭제 중" : "삭제"}
                      </SpaceActionButton>
                    </SpaceActionColumn>
                  </SpaceCardRow>
                </SpaceCard>
              ))}
            </SpaceContainer>
          </SpaceInner>
        </SpacePage>
      </SpaceMain>

      {editingLand ? (
        <SpaceModalOverlay>
          <SpaceModal onSubmit={handleUpdateLand}>
            {/* 내 토지 수정 모달 */}
            <SpaceModalHeader>
              <h2>토지 수정</h2>
              <SpaceModalClose type="button" onClick={() => setEditingLand(null)}>
                ×
              </SpaceModalClose>
            </SpaceModalHeader>

            <SpaceModalField>
              주소
              <SpaceModalInput
                value={editForm.address}
                onChange={handleEditChange("address")}
                placeholder="주소를 입력해주세요"
              />
            </SpaceModalField>

            <SpaceModalField>
              거래 방식
              <SpaceModalSelect
                value={editForm.transactionType}
                onChange={handleEditChange("transactionType")}
              >
                <option value="SALE">매매</option>
                <option value="LEASE">임대</option>
              </SpaceModalSelect>
            </SpaceModalField>

            <SpaceModalField>
              희망 가격 (만원 단위)
              <SpaceModalInput
                value={editForm.desiredPrice}
                onChange={handleEditChange("desiredPrice")}
                placeholder="예) 150000"
              />
            </SpaceModalField>

            <SpaceModalField>
              설명
              <SpaceModalTextarea
                value={editForm.description}
                onChange={handleEditChange("description")}
                placeholder="토지 설명을 입력해주세요"
              />
            </SpaceModalField>

            {editError ? <SpaceModalError>{editError}</SpaceModalError> : null}

            <SpaceModalActions>
              <SpaceActionButton type="button" $secondary onClick={() => setEditingLand(null)}>
                취소
              </SpaceActionButton>
              <SpaceActionButton type="submit" disabled={savingId === editingLand.id}>
                {savingId === editingLand.id ? "저장 중" : "저장"}
              </SpaceActionButton>
            </SpaceModalActions>
          </SpaceModal>
        </SpaceModalOverlay>
      ) : null}

      <Specific land={selectedLand} onClose={() => setSelectedLand(null)} />
    </SpaceWrapper>
  );
}

export default MySpace;
