import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Map, Mountain, Camera } from "lucide-react";
import { RegisterPageHeader } from "../shared";
import { Api } from "@/contents/apiEndpoints";
import { authFetch } from "@/lib/auth";
import {
  FavoritesAddress,
  FavoritesBadge,
  FavoritesButton,
  FavoritesContent,
  FavoritesDate,
  FavoritesDescription,
  FavoritesFilterButton,
  FavoritesFilterRow,
  FavoritesHeader,
  FavoritesHeart,
  FavoritesInfoRow,
  FavoritesItem,
  FavoritesList,
  FavoritesMetaGrid,
  FavoritesMetaItem,
  FavoritesMetaLabel,
  FavoritesMetaSub,
  FavoritesMetaValue,
  FavoritesPage,
  FavoritesPageButton,
  FavoritesPagination,
  FavoritesShell,
  FavoritesSort,
  FavoritesSortCount,
  FavoritesSortLabel,
  FavoritesThumb,
  FavoritesThumbWrap,
  FavoritesTitle,
  FavoritesToolbar,
} from "./LandFavorites.styles";

const favoriteFilters = [
  { key: "all", label: "전체" },
  { key: "sale", label: "매매" },
  { key: "rent", label: "임대" },
  { key: "hope", label: "사업 희망자" },
];

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
  if (value === null || value === undefined || value === "") return "-";

  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  return new Intl.NumberFormat("ko-KR").format(numeric);
};

const formatArea = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return Number.isInteger(value) ? value.toLocaleString("ko-KR") : String(value);
};

const getTransactionLabel = (value) => {
  if (!value) return "매매";
  const upper = String(value).toUpperCase();
  if (upper.includes("LEASE") || upper.includes("RENT")) return "임대";
  if (upper.includes("HOPE")) return "사업 희망자";
  return "매매";
};

function LandFavorites() {
  // 찜 목록 필터 상태
  const [activeFilter, setActiveFilter] = useState("all");
  // 찜 목록 데이터
  const [wishes, setWishes] = useState([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 에러 상태
  const [error, setError] = useState("");
  // 삭제 중인 항목
  const [removingId, setRemovingId] = useState(null);
  // 페이지네이션은 UI만 먼저 보여주는 상태
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWishes = async () => {
    // 찜 목록 조회
    setIsLoading(true);
    setError("");

    try {
      const response = await authFetch(Api.Wishes, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "관심 토지를 불러오지 못했습니다.");
      }

      const list = Array.isArray(data?.data) ? data.data : [];
      setWishes(list);
    } catch (err) {
      setError(err.message || "관심 토지를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchWishes();
  }, []);

  const filteredWishes = useMemo(() => {
    if (activeFilter === "all") return wishes;
    if (activeFilter === "sale") return wishes.filter((wish) => getTransactionLabel(wish.status) === "매매");
    if (activeFilter === "rent") return wishes.filter((wish) => getTransactionLabel(wish.status) === "임대");
    if (activeFilter === "hope") return wishes.filter((wish) => getTransactionLabel(wish.status) === "사업 희망자");
    return wishes;
  }, [activeFilter, wishes]);

  const handleRemoveWish = async (wish) => {
    // 찜 해제
    if (!wish?.landId || removingId) return;

    setRemovingId(wish.landId);

    try {
      const response = await authFetch(`${Api.Wishes}/${wish.landId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "찜을 취소하지 못했습니다.");
      }

      setWishes((prev) => prev.filter((item) => item.landId !== wish.landId));
    } catch (err) {
      setError(err.message || "찜을 취소하지 못했습니다.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <FavoritesPage>
      {/* 상단 공통 헤더 */}
      <RegisterPageHeader />

      <FavoritesShell>
        {/* 목록 제목과 설명 */}
        <FavoritesHeader>
          <FavoritesTitle>관심 토지</FavoritesTitle>
          <FavoritesDescription>
            내가 찜한 토지를 한눈에 확인하고 관리할 수 있습니다.
          </FavoritesDescription>
        </FavoritesHeader>

        {/* 필터와 정렬 */}
        <FavoritesToolbar>
          <FavoritesFilterRow>
            {favoriteFilters.map((filter) => (
              <FavoritesFilterButton
                key={filter.key}
                type="button"
                $active={activeFilter === filter.key}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </FavoritesFilterButton>
            ))}
          </FavoritesFilterRow>

          <FavoritesSort>
            <FavoritesSortCount>총 {filteredWishes.length}건</FavoritesSortCount>
            <FavoritesSortLabel type="button">
              최근 저장순
            </FavoritesSortLabel>
            <ChevronDown size={18} strokeWidth={2} />
          </FavoritesSort>
        </FavoritesToolbar>

        {isLoading ? (
          <div style={{ padding: "36px 0", textAlign: "center", color: "#6a6a6a" }}>
            관심 토지를 불러오는 중입니다.
          </div>
        ) : error ? (
          <div style={{ padding: "36px 0", textAlign: "center", color: "#d92d20", fontWeight: 700 }}>
            {error}
          </div>
        ) : (
          <>
            {/* 관심 토지 카드 목록 */}
            <FavoritesList>
              {filteredWishes.map((wish) => {
                const transactionLabel = getTransactionLabel(wish.status);

                return (
                  <FavoritesItem key={wish.wishId ?? wish.landId}>
                    <FavoritesThumbWrap>
                      <FavoritesThumb
                        style={{
                          backgroundImage: wish.landImagePath
                            ? `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)), url(${resolveImageUrl(wish.landImagePath)})`
                            : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <FavoritesBadge>{transactionLabel}</FavoritesBadge>
                      <FavoritesHeart
                        type="button"
                        aria-label="찜 제거"
                        onClick={() => handleRemoveWish(wish)}
                        disabled={removingId === wish.landId}
                      >
                        <Heart size={22} fill="currentColor" strokeWidth={1.7} />
                      </FavoritesHeart>
                    </FavoritesThumbWrap>

                    <FavoritesContent>
                      <FavoritesAddress>{wish.address || "-"}</FavoritesAddress>

                      {/* 토지의 핵심 정보만 표시 */}
                      <FavoritesMetaGrid>
                        <FavoritesMetaItem>
                          <FavoritesMetaLabel>
                            <Mountain size={14} strokeWidth={2} />
                            면적
                          </FavoritesMetaLabel>
                          <FavoritesMetaValue>
                            {formatArea(wish.area)}
                            <FavoritesMetaSub>㎡</FavoritesMetaSub>
                          </FavoritesMetaValue>
                        </FavoritesMetaItem>

                        <FavoritesMetaItem>
                          <FavoritesMetaLabel>
                            <Map size={14} strokeWidth={2} />
                            지목
                          </FavoritesMetaLabel>
                          <FavoritesMetaValue>{wish.status || "-"}</FavoritesMetaValue>
                        </FavoritesMetaItem>

                        <FavoritesMetaItem>
                          <FavoritesMetaLabel>
                            <Camera size={14} strokeWidth={2} />
                            용도지역
                          </FavoritesMetaLabel>
                          <FavoritesMetaValue>{wish.status || "-"}</FavoritesMetaValue>
                        </FavoritesMetaItem>

                        <FavoritesMetaItem>
                          <FavoritesMetaLabel>
                            <Heart size={14} strokeWidth={2} />
                            희망 가격
                          </FavoritesMetaLabel>
                          <FavoritesMetaValue $highlight>
                            {formatPrice(wish.desiredPrice)}
                          </FavoritesMetaValue>
                        </FavoritesMetaItem>
                      </FavoritesMetaGrid>

                      <FavoritesInfoRow>
                        <FavoritesDate>
                          등록일{" "}
                          {wish.wishedAt ? String(wish.wishedAt).slice(0, 10).replaceAll("-", ".") : "-"}
                        </FavoritesDate>

                        <FavoritesButton type="button">상세보기</FavoritesButton>
                      </FavoritesInfoRow>
                    </FavoritesContent>
                  </FavoritesItem>
                );
              })}
            </FavoritesList>

            {filteredWishes.length === 0 ? (
              <div style={{ padding: "36px 0", textAlign: "center", color: "#6a6a6a" }}>
                아직 찜한 토지가 없습니다.
              </div>
            ) : null}

            {/* 페이지 이동 UI */}
            <FavoritesPagination>
              <FavoritesPageButton type="button" aria-label="이전 페이지" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>
                <ChevronLeft size={18} strokeWidth={2.3} />
              </FavoritesPageButton>
              <FavoritesPageButton type="button" $active={currentPage === 1} onClick={() => setCurrentPage(1)}>
                1
              </FavoritesPageButton>
              <FavoritesPageButton type="button" $active={currentPage === 2} onClick={() => setCurrentPage(2)}>
                2
              </FavoritesPageButton>
              <FavoritesPageButton type="button" $active={currentPage === 3} onClick={() => setCurrentPage(3)}>
                3
              </FavoritesPageButton>
              <FavoritesPageButton type="button" aria-label="다음 페이지" onClick={() => setCurrentPage((prev) => prev + 1)}>
                <ChevronRight size={18} strokeWidth={2.3} />
              </FavoritesPageButton>
            </FavoritesPagination>
          </>
        )}
      </FavoritesShell>
    </FavoritesPage>
  );
}

export default LandFavorites;
