import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Mountain, Map, Camera } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import Specific from "@/components/ui/SpecificPopUp/Specific";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  formatMoney,
  formatArea,
  normalizeBaseUrl,
  resolveImageUrl,
  normalizeWish,
  getTransactionLabel,
} from "../landUtils";
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
  { key: "SALE", label: "매매" },
  { key: "LEASE", label: "임대" },
];

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

function LandFavorites() {
  const navigate = useNavigate();
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
  // 상세보기 팝업에 표시할 토지입니다.
  const [selectedLand, setSelectedLand] = useState(null);
  // 상세 정보 조회 중인 토지 ID입니다.
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  // 페이지네이션은 UI만 먼저 보여주는 상태
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWishes = async () => {
    // 로그인하지 않은 사용자는 관심 토지 조회 전에 로그인 화면으로 이동합니다.
    if (!getValidAccessToken()) {
      navigate("/login", { replace: true });
      return;
    }

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

      const wishList = Array.isArray(data?.data) ? data.data : [];
      const enrichedList = await Promise.all(
        wishList.map(async (wish, index) => {
          // 찜 응답에 없는 이미지와 상세 정보를 토지 상세 API로 보강합니다.
          if (!wish?.landId) return normalizeWish(wish, index);

          try {
            const detailResponse = await authFetch(Api.Land(wish.landId), {
              method: "GET",
            });
            const detailContentType = detailResponse.headers.get("content-type") || "";
            const detailData = detailContentType.includes("application/json")
              ? await detailResponse.json()
              : null;

            if (!detailResponse.ok) return normalizeWish(wish, index);

            return normalizeWish({ ...detailData?.data, ...wish }, index);
          } catch {
            return normalizeWish(wish, index);
          }
        }),
      );

      const list = enrichedList.sort((a, b) => new Date(b.wishedAt) - new Date(a.wishedAt));
      setWishes(list);
    } catch (err) {
      setError(err.message || "관심 토지를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 관심 토지 페이지 진입 시 찜 목록을 조회합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchWishes();
  }, []);

  // 로그인하지 않은 사용자는 에러 문구 대신 로그인 화면으로 바로 이동합니다.
  if (!getValidAccessToken()) return null;

  const filteredWishes = useMemo(() => {
    if (activeFilter === "all") return wishes;
    return wishes.filter((wish) => {
      const label = getTransactionLabel(wish.transactionType);
      if (activeFilter === "SALE") return label === "매매";
      if (activeFilter === "LEASE") return label === "임대";
      return true;
    });
  }, [activeFilter, wishes]);

  const handleRemoveWish = async (wish) => {
    // 찜 해제
    if (!wish?.landId || removingId) return;

    setRemovingId(wish.landId);

    try {
      const response = await authFetch(Api.Wish(wish.landId), {
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

  const handleOpenDetail = async (wish) => {
    // 관심 토지 상세보기는 페이지 이동 없이 팝업으로 표시합니다.
    if (!wish?.landId || detailLoadingId) return;

    setDetailLoadingId(wish.landId);
    setError("");

    try {
      const response = await authFetch(Api.Land(wish.landId), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "토지 상세 정보를 불러오지 못했습니다.");
      }

      setSelectedLand(data?.data || wish);
    } catch (err) {
      setError(err.message || "토지 상세 정보를 불러오지 못했습니다.");
    } finally {
      setDetailLoadingId(null);
    }
  };

  return (
    <FavoritesPage>
      {/* 상단 공통 헤더 */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />
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
                const transactionLabel = getTransactionLabel(wish.transactionType);

                return (
                  <FavoritesItem key={wish.id}>
                    <FavoritesThumbWrap>
                      <FavoritesThumb
                        style={{
                          backgroundImage: wish.landImagePath
                            ? `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)), url(${resolveImageUrl(wish.landImagePath, API_BASE_URL)})`
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
                            상태
                          </FavoritesMetaLabel>
                          <FavoritesMetaValue>{wish.status || "-"}</FavoritesMetaValue>
                        </FavoritesMetaItem>

                        <FavoritesMetaItem>
                          <FavoritesMetaLabel>
                            <Camera size={14} strokeWidth={2} />
                            거래유형
                          </FavoritesMetaLabel>
                          <FavoritesMetaValue>{transactionLabel}</FavoritesMetaValue>
                        </FavoritesMetaItem>

                        <FavoritesMetaItem>
                          <FavoritesMetaLabel>
                            <Heart size={14} strokeWidth={2} />
                            희망 가격
                          </FavoritesMetaLabel>
                          <FavoritesMetaValue $highlight>
                            {formatMoney(wish.desiredPrice)}
                          </FavoritesMetaValue>
                        </FavoritesMetaItem>
                      </FavoritesMetaGrid>

                      <FavoritesInfoRow>
                        <FavoritesDate>
                          찜한 날짜{" "}
                          {wish.wishedAt ? String(wish.wishedAt).slice(0, 10).replaceAll("-", ".") : "-"}
                        </FavoritesDate>

                        <FavoritesButton
                          type="button"
                          onClick={() => handleOpenDetail(wish)}
                          disabled={detailLoadingId === wish.landId}
                        >
                          {detailLoadingId === wish.landId ? "불러오는 중" : "상세보기"}
                        </FavoritesButton>
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

      {/* 관심 토지 상세보기 팝업 */}
      <Specific land={selectedLand} onClose={() => setSelectedLand(null)} />
    </FavoritesPage>
  );
}

export default LandFavorites;
