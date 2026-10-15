import { ChevronDown, CalendarDays, Plus, Shapes, SquarePen, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import PageLoading from "@/components/ui/PageLoading/PageLoading";
import Specific from "@/components/ui/SpecificPopUp/Specific";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import { formatKoreanMoneyFromManwon } from "@/utils/priceFormat";
import { validateLandAddress } from "@/utils/validateLandAddress";
import AreaValue from "@/components/ui/AreaValue";
import { ListPageDivider } from "@/styles/listPage";
import { formatLandDate, landTimestamp, compareNullableNumbers } from "@/utils/landList";
import { withRequestTimeout, forEachConcurrent } from "@/utils/asyncRequests";
import { readApiResponse } from "@/utils/apiResponse";
import { mergeLandImages } from "@/utils/landImages";
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
  SpaceHeader,
  SpaceInfoRow,
  SpaceImageManagerActions,
  SpaceImageManagerButton,
  SpaceImageManagerClose,
  SpaceImageManagerDescription,
  SpaceImageManagerDialog,
  SpaceImageManagerEmpty,
  SpaceImageManagerHeader,
  SpaceImageManagerList,
  SpaceImageManagerOverlay,
  SpaceImageManagerThumbnail,
  SpaceImageManagerUpload,
  SpaceInner,
  SpaceMain,
  SpaceModal,
  SpaceModalActions,
  SpaceModalClose,
  SpaceModalError,
  SpaceModalField,
  SpaceModalHeader,
  SpaceModalImage,
  SpaceModalInput,
  SpaceModalReadonlyNote,
  SpaceModalFileButton,
  SpaceModalFileInput,
  SpaceModalOverlay,
  SpaceDeleteOverlay,
  SpaceDeleteDialog,
  SpaceDeleteIcon,
  SpaceDeleteActions,
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
  const rawValue = value || "https://api.helioss.site";
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }

  return `https://${rawValue.replace(/\/$/, "")}`;
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const LOCAL_REGISTERED_AT_KEY = "helios-land-registered-at";

const resolveImageUrl = (path, revision) => {
  if (!path) return "";
  // 저장 경로를 확인하지 못한 경우의 로컬 미리보기도 그대로 표시합니다.
  if (path.startsWith("blob:") || path.startsWith("data:image/")) return path;
  const url = path.startsWith("http://") || path.startsWith("https://") ? path
    : path.startsWith("/") ? `${API_BASE_URL}${path}`
    : path.startsWith("uploads/") ? `${API_BASE_URL}/${path}`
    : `${API_BASE_URL}/uploads/lands/${path}`;
  // 서버가 같은 파일 경로를 덮어써도 수정 직후에는 새 이미지를 요청합니다.
  return revision ? `${url}${url.includes("?") ? "&" : "?"}v=${revision}` : url;
};

// 서버 이미지 항목에서 실제 경로 문자열을 꺼냅니다.
const getImagePath = (item) => (
  typeof item === "string"
    ? item
    : item?.url || item?.path || item?.filePath || item?.imageUrl || ""
);

// 서버 이미지 응답이 배열 또는 단일 경로 어느 형태로 와도 전체 경로를 수집합니다.
const getAllImagePaths = (land = {}) => {
  const imageCandidates = [
    land.landImagePaths,
    land.imagePaths,
    land.images,
    land.imageUrls,
    land.landImages,
    land.files,
  ];
  // 단일 경로 필드도 이미지 목록 뒤에 포함해 누락을 방지합니다.
  const scalarCandidates = [
    land.landImagePath,
    land.imagePath,
    land.thumbnailPath,
    land.thumbnailUrl,
  ];
  const paths = imageCandidates
    .flatMap((candidate) => Array.isArray(candidate) ? candidate : [])
    .map(getImagePath)
    .concat(scalarCandidates.map(getImagePath))
    .filter(Boolean);

  return [...new Set(paths)];
};

// 대표 이미지가 필요한 기존 화면에는 전체 이미지 중 첫 번째 경로를 사용합니다.
const getFirstImagePath = (land) => {
  return getAllImagePaths(land)[0] || "";
};

const toManwonInput = (value) => {
  // 서버 원 단위 가격을 수정 폼의 만원 단위 입력값으로 변환합니다.
  const wonPrice = Number(String(value ?? "").replace(/[^\d]/g, ""));
  if (!wonPrice || Number.isNaN(wonPrice)) return "";
  return formatManwonInput(Math.floor(wonPrice / 10000));
};

const formatManwonInput = (value) => {
  // 수정 모달 금액 입력값을 3자리마다 쉼표로 표시합니다.
  const digits = String(value ?? "").replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
};

const toWonPrice = (value) => {
  // 수정 폼에서는 만원 단위로 입력받고 서버에는 원 단위로 전송합니다.
  const manwonPrice = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isNaN(manwonPrice) ? 0 : manwonPrice * 10000;
};

const formatPrice = (value) => {
  // 가격은 서버 기준인 원 단위로 통일해서 표시합니다.
  return formatKoreanMoneyFromManwon(value);
};

const formatArea = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return Number.isInteger(value) ? value.toLocaleString("ko-KR") : String(value);
};

const formatDesiredArea = (value) => {
  // 희망 면적은 ㎡와 평을 함께 표시해 등록 조건을 바로 확인합니다.
  if (value === null || value === undefined || value === "") return "-";
  const area = Number(String(value).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(area) || area <= 0) return "-";
  const formattedArea = area.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  const pyeong = Math.round(area / 3.3058).toLocaleString("ko-KR");
  return `${formattedArea}㎡ (약 ${pyeong}평)`;
};

const getCreatedDate = (land) => {
  // 서버의 날짜 표기 방식이 달라도 등록일을 우선적으로 찾습니다.
  const candidates = [
    land.createdAt,
    land.createdDate,
    land.registeredAt,
    land.registerDate,
    land.registrationDate,
    land.registeredDate,
    land.regDate,
    land.registDate,
    land.createDate,
    land.createdOn,
    land.created_at,
    land.registered_at,
    land.registration_date,
    land.reg_date,
    land.registDt,
    land.regDt,
    land.reg_dt,
    land.data?.createdAt,
    land.data?.createdDate,
    land.data?.registrationDate,
  ];

  const directDate = candidates.find((value) => value !== null && value !== undefined && value !== "");
  if (directDate) return directDate;

  // 백엔드 등록일 필드가 생기기 전까지 신규 등록분의 시각을 임시 보완합니다.
  try {
    const storedDates = JSON.parse(localStorage.getItem(LOCAL_REGISTERED_AT_KEY) || "{}");
    const landKey = land.landId ?? land.id ?? land.address;
    if (landKey && storedDates[landKey]) return storedDates[landKey];
  } catch {
    // 저장된 임시 날짜를 읽지 못해도 목록 표시를 계속합니다.
  }

  // DTO가 등록일을 별도 이름으로 내려주는 경우를 대비합니다.
  const dateEntry = Object.entries(land).find(([key, value]) => {
    return value && /^(created|registered|registration|regist|register)/i.test(key) && !/updated/i.test(key);
  });

  return dateEntry?.[1] || null;
};

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

const extractObject = (payload) => {
  // 상세 응답의 data 래퍼를 벗겨 실제 토지 객체를 가져옵니다.
  if (!payload || typeof payload !== "object") return null;
  return payload.data?.data || payload.data || payload.result || payload;
};

const getTransactionLabel = (value) => {
  const normalized = String(value || "").toUpperCase();
  if (normalized.includes("LEASE") || normalized.includes("RENT") || normalized.includes("임대")) return "임대";
  if (normalized.includes("HOPE") || normalized.includes("사업")) return "사업 희망";
  return "매매";
};

const getTransactionValue = (land) => {
  // 상태(PENDING 등)는 거래 방식으로 사용하지 않고 유형 필드만 읽습니다.
  return (
    land.transactionType ||
    land.dealType ||
    land.tradeType ||
    land.salesType ||
    land.transactionMethod ||
    land.landTransactionType ||
    "SALE"
  );
};

const getEditTransactionType = (value, fallbackLabel) => {
  // 서버 거래 방식 값을 수정 폼에서 쓰는 값으로 정규화합니다.
  const normalized = String(value || fallbackLabel || "").toUpperCase();
  if (normalized.includes("HOPE") || normalized.includes("사업")) return "BUSINESS_HOPE";
  if (normalized.includes("LEASE") || normalized.includes("RENT") || fallbackLabel === "임대") return "LEASE";
  return "SALE";
};

const getEditFormFromLand = (land) => {
  // 수정 모달에 기존 토지 값을 빠짐없이 채웁니다.
  const raw = land.raw || land;

  return {
    address: raw.address || land.title || "",
    desiredPrice: toManwonInput(raw.desiredPrice ?? raw.amount ?? raw.price),
    description: raw.description || raw.memo || raw.content || "",
    transactionType: getEditTransactionType(getTransactionValue(raw), land.tradeType),
  };
};

const normalizeLand = (land, index) => {
  // 서버 응답을 카드에서 쓰기 좋은 형태로 정리합니다.
  const transactionType = getTransactionValue(land);
  const landImage = getFirstImagePath(land);
  const rawPrice = land.desiredPrice ?? land.amount ?? land.price ?? null;
  const rawDesiredArea = land.desiredArea ?? land.hopeArea ?? land.requestedArea;
  const isBusinessHope = !rawPrice && rawDesiredArea;
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
    date: formatLandDate(getCreatedDate(land)),
    registeredAt: landTimestamp(getCreatedDate(land)),
    rawPrice,
    // 사업 희망은 가격 없이 희망 면적만 등록된 경우에도 구분합니다.
    tradeType: isBusinessHope ? "사업 희망" : getTransactionLabel(transactionType),
    price: rawPrice ? formatPrice(rawPrice) : "-",
    desiredArea: formatDesiredArea(rawDesiredArea),
    accent: accentPool[index % accentPool.length],
    imageUrl: resolveImageUrl(landImage, land.imageRevision),
    raw: land,
  };
};

function MySpace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = (searchParams.get("keyword") || "").trim().toLowerCase();
  const [keyword, setKeyword] = useState(() => searchParams.get("keyword") || "");
  const [activeSort, setActiveSort] = useState("최근 등록순");
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
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  // 수정 모달 위에 표시되는 이미지 관리 팝업의 열림 상태입니다.
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const editImageInputRef = useRef(null);
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [landPendingDelete, setLandPendingDelete] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState(null);

  useEffect(() => {
    if (!landPendingDelete) return undefined;
    // 삭제 확인창은 Escape로도 닫을 수 있습니다.
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !deletingId) setLandPendingDelete(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [landPendingDelete, deletingId]);

  const fetchMyLands = useCallback(async (signal) => {
    // 로그인하지 않은 사용자는 내 공간을 볼 수 없으므로 로그인으로 보냅니다.
    if (!getValidAccessToken()) {
      navigate("/login");
      return;
    }

    // 서버에서 로그인한 사용자의 토지 목록만 가져옵니다.
    setIsLoading(true);
    setError("");

    try {
      const data = await withRequestTimeout(async (requestSignal) => {
        const response = await authFetch(Api.MyLands, { signal: requestSignal });
        return readApiResponse(response, "내 토지 목록을 불러오지 못했습니다.");
      }, signal);
      if (signal?.aborted) return;
      const list = extractArray(data);
      // 전체 목록은 먼저 표시하고 누락된 정보만 도착하는 순서대로 보완합니다.
      setLands(list.map(normalizeLand));
      setIsLoading(false);
      await forEachConcurrent(list, async (land, index) => {
          if (signal?.aborted) return;
          // 목록 응답에 없는 등록일·희망 면적을 상세 API에서 보완합니다.
          const hasDesiredArea =
            land.desiredArea !== null && land.desiredArea !== undefined && land.desiredArea !== "";
          if (getCreatedDate(land) && hasDesiredArea) return land;

          const landId = land.landId ?? land.id;
          if (!landId) return land;

          try {
            const detailData = await withRequestTimeout(async (requestSignal) => {
              const response = await authFetch(Api.Land(landId), { signal: requestSignal });
              return readApiResponse(response, "토지 상세 정보를 불러오지 못했습니다.");
            }, signal);
            if (signal?.aborted) return;
            const updated = normalizeLand({ ...land, ...extractObject(detailData) }, index);
            // 사용자가 이미 수정·삭제한 행에는 오래된 보완 응답을 덮어쓰지 않습니다.
            setLands((prev) => prev.map((item) => item.raw === land ? updated : item));
          } catch {
            return land;
          }
      });
    } catch (err) {
      if (signal?.aborted) return;
      setError(err.name === "AbortError" ? "목록 조회 시간이 초과됐습니다. 새로고침 후 다시 시도해주세요." : err.message || "내 토지 목록을 불러오지 못했습니다.");
      setLands([]);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    // 내 공간 페이지 진입 시 내가 등록한 토지를 조회합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMyLands(controller.signal);
    return () => controller.abort();
  }, [fetchMyLands]);

  const sortedLands = useMemo(() => {
    // 상태 필터 제거 후 전체 토지를 기준으로 정렬합니다.
    // URL 검색어를 실제 주소 목록에 적용한 뒤 정렬합니다.
    const next = lands.filter((land) => !searchKeyword || String(land.title || "").toLowerCase().includes(searchKeyword));

    if (activeSort === "최근 등록순") {
      return next.sort((a, b) => compareNullableNumbers(a.registeredAt, b.registeredAt, true));
    }

    if (activeSort === "오래된 등록순") {
      return next.sort((a, b) => compareNullableNumbers(a.registeredAt, b.registeredAt));
    }

    if (activeSort === "가격 높은 순") {
      return next.sort((a, b) => compareNullableNumbers(a.rawPrice, b.rawPrice, true));
    }

    if (activeSort === "가격 낮은 순") {
      return next.sort((a, b) => compareNullableNumbers(a.rawPrice, b.rawPrice));
    }

    return next;
  }, [activeSort, lands, searchKeyword]);

  const totalCount = useMemo(() => lands.length, [lands]);
  // 선택한 토지의 등록 이미지를 이미지 관리 팝업용 URL 목록으로 변환합니다.
  const editImageUrls = useMemo(() => {
    if (!editingLand) return [];
    const revision = editingLand.raw?.imageRevision;
    const urls = getAllImagePaths(editingLand.raw || editingLand)
      .map((path) => resolveImageUrl(path, revision));
    return urls.length > 0 ? urls : editImagePreview ? [editImagePreview] : [];
  }, [editingLand, editImagePreview]);

  const openEditModal = async (land) => {
    // 수정 시 기존 값 유지를 위해 단일 상세 정보를 먼저 조회합니다.
    if (!land?.id || editLoadingId) return;

    setEditLoadingId(land.id);
    setEditError("");
    // 새로운 토지 수정 화면을 열 때 이전 이미지 관리 팝업 상태를 초기화합니다.
    setIsImageManagerOpen(false);

    try {
      const response = await authFetch(Api.Land(land.id), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;
      const detailRaw = response.ok ? data?.data : null;
      const nextLand = detailRaw
        ? { ...land, raw: mergeLandImages({ ...land.raw, ...detailRaw }, detailRaw, getFirstImagePath(land.raw || land)) }
        : land;

      setEditingLand(nextLand);
      setEditForm(getEditFormFromLand(nextLand));
      setEditImageFile(null);
      setEditImagePreview(resolveImageUrl(getFirstImagePath(nextLand.raw || nextLand), nextLand.raw?.imageRevision));
    } catch {
      setEditingLand(land);
      setEditForm(getEditFormFromLand(land));
      setEditImageFile(null);
      setEditImagePreview(resolveImageUrl(getFirstImagePath(land.raw || land), land.raw?.imageRevision));
    } finally {
      setEditLoadingId(null);
    }
  };

  const handleEditChange = (field) => (event) => {
    // 수정 입력값을 상태에 반영합니다.
    const value = field === "desiredPrice" ? formatManwonInput(event.target.value) : event.target.value;
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setEditError("");
  };

  const handleEditImageChange = (event) => {
    // 수정 모달에서 선택한 대표 이미지를 저장 전 미리 보여줍니다.
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEditError("이미지 파일만 선택해주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEditError("이미지는 5MB 이하로 선택해주세요.");
      return;
    }

    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
    setEditError("");
  };

  const handleUpdateLand = async (event) => {
    event.preventDefault();

    if (!editingLand?.id || savingId) return;
    // 수정 화면에서 주소값이 변경되더라도 서버에는 기존 등록 주소만 전달합니다.
    const originalAddress = String(
      editingLand.raw?.address || editingLand.title || "",
    ).trim();
    // 주소 조회·이미지 업로드 사이에 계정이 바뀌면 후속 저장을 중단합니다.
    const savingToken = getValidAccessToken();
    if (!savingToken) {
      setEditError("로그인 후 다시 시도해주세요.");
      return;
    }
    if (!originalAddress) {
      setEditError("기존 주소 정보를 확인할 수 없습니다.");
      return;
    }

    setSavingId(editingLand.id);
    setEditError("");
    let informationSaved = false;

    try {
      // 내 토지 수정 요청을 서버에 보냅니다.
      if (!(await validateLandAddress(originalAddress))) {
        setEditError("시·군·구가 아닌 상세 지번 또는 도로명 주소를 검색 가능한 상태에서 입력해주세요.");
        return;
      }
      if (savingToken !== getValidAccessToken()) return;
      const payload = {
        // 주소는 수정할 수 없으므로 기존 등록 주소를 그대로 유지합니다.
        address: originalAddress,
        desiredPrice: editForm.transactionType === "BUSINESS_HOPE"
          ? null
          : editForm.desiredPrice
          ? toWonPrice(editForm.desiredPrice)
          : editingLand.raw?.desiredPrice ?? editingLand.raw?.amount ?? editingLand.raw?.price ?? null,
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
      if (savingToken !== getValidAccessToken()) return;

      // 정보 저장 성공은 즉시 반영합니다. 후속 이미지 실패가 이를 되돌리지는 않습니다.
      const savedRaw = { ...editingLand.raw, ...payload, ...(data?.data || {}) };
      const savedLand = { ...normalizeLand(savedRaw, 0), accent: editingLand.accent };
      informationSaved = true;
      setLands((prev) => prev.map((land) => land.id === editingLand.id ? savedLand : land));
      setEditingLand(savedLand);

      let imageData = null;
      if (editImageFile) {
        // 선택한 대표 이미지를 별도 이미지 수정 API로 업로드합니다.
        const imageFormData = new FormData();
        imageFormData.append("image", editImageFile);
        const imageResponse = await authFetch(Api.LandImage(editingLand.id), {
          method: "PATCH",
          body: imageFormData,
        });
        const imageContentType = imageResponse.headers.get("content-type") || "";
        imageData = imageContentType.includes("application/json") ? await imageResponse.json() : null;

        if (!imageResponse.ok) {
          throw new Error(imageData?.message || imageData?.data?.message || "토지 이미지를 수정하지 못했습니다.");
        }
      }

      // 이미지 응답이 경로를 주지 않으면 상세 조회로 실제 저장 경로를 확인합니다.
      let imageUpdate = imageData?.data || imageData;
      if (editImageFile && !getFirstImagePath(imageUpdate || {})) {
        try {
          imageUpdate = await withRequestTimeout(async (signal) => {
            const response = await authFetch(Api.Land(editingLand.id), { signal });
            return extractObject(await readApiResponse(response, "이미지 정보를 확인하지 못했습니다."));
          });
        } catch {
          // 업로드 자체는 성공했으므로 재조회 실패는 새 미리보기로 보완합니다.
          imageUpdate = null;
        }
      }
      if (savingToken !== getValidAccessToken()) return;
      const updatedRaw = editImageFile ? mergeLandImages(savedRaw, imageUpdate, editImagePreview) : savedRaw;
      if (editImageFile) updatedRaw.imageRevision = Date.now();
      const updatedLand = normalizeLand(updatedRaw, 0);
      setLands((prev) =>
        prev.map((land) => (land.id === editingLand.id ? { ...updatedLand, accent: land.accent } : land))
      );
      setEditingLand(null);
    } catch (err) {
      setEditError(informationSaved
        ? "토지 정보는 저장됐지만 이미지 업로드를 완료하지 못했습니다. 선택한 이미지는 유지돼 있어요. 다시 저장하거나 창을 닫아주세요."
        : err.message || "토지를 수정하지 못했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteLand = (land) => {
    if (!land?.id || deletingId) return;
    setLandPendingDelete(land);
  };

  const confirmDeleteLand = async () => {
    const land = landPendingDelete;
    if (!land?.id || deletingId) return;
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
      setLandPendingDelete(null);
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

      setSelectedLand({ ...(land.raw || land), ...(data?.data || {}) });
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
          onSearch={() => setSearchParams(keyword.trim() ? { keyword: keyword.trim() } : {})}
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

              {/* 등록 현황과 등록 버튼은 분리선 위에 함께 표시합니다. */}
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
            <ListPageDivider />

            {/* 목록·상세·수정 정보를 요청하는 동안 데이터 영역에 공통 로더를 표시합니다. */}
            <PageLoading
              isLoading={isLoading || detailLoadingId !== null || editLoadingId !== null}
            >
              <SpaceToolbar>
                <SpaceSortBar>
                  <SpaceStatText>
                    <strong>{searchKeyword ? "검색 결과" : "총"} {sortedLands.length}건</strong>
                  </SpaceStatText>
                  {/* 정렬 선택 */}
                  <SpaceFilterButton
                    type="button"
                    $active={false}
                    onClick={() => {
                      // 정렬 버튼을 누를 때 등록일과 가격 기준을 순서대로 전환합니다.
                      const sortOptions = ["최근 등록순", "오래된 등록순", "가격 높은 순", "가격 낮은 순"];
                      setActiveSort((prev) => sortOptions[(sortOptions.indexOf(prev) + 1) % sortOptions.length]);
                    }}
                  >
                    {activeSort}
                    <ChevronDown size={16} strokeWidth={2.5} />
                  </SpaceFilterButton>
                </SpaceSortBar>
              </SpaceToolbar>

              {error ? (
                <div className="py-2 text-center text-sm font-semibold text-[#b42318]">
                  {error}
                </div>
              ) : null}

              <SpaceContainer>
                {/* 검색 결과가 없을 때 빈 목록만 보이지 않도록 안내합니다. */}
                {!isLoading && !error && sortedLands.length === 0 ? (
                  <p role="status">{searchKeyword ? "검색 결과가 없습니다." : "등록한 토지가 없습니다."}</p>
                ) : null}
                {sortedLands.map((item) => (
                <SpaceCard key={item.id}>
                  <SpaceCardRow>
                    <SpaceCardImage $accent={item.accent}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full" />
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

                      </SpaceCardHeader>

                      <SpaceCardMeta>
                        <SpaceCardMetaItem>
                          <SpaceCardMetaLabel>
                            <Shapes size={14} strokeWidth={2.2} />
                            면적
                          </SpaceCardMetaLabel>
                          <SpaceCardMetaValue><AreaValue value={item.raw.area} /></SpaceCardMetaValue>
                        </SpaceCardMetaItem>
                        <SpaceCardMetaItem>
                          <SpaceCardMetaLabel>
                            <Shapes size={14} strokeWidth={2.2} />
                            희망 면적
                          </SpaceCardMetaLabel>
                          <SpaceCardMetaValue><AreaValue value={item.raw.desiredArea ?? item.raw.hopeArea ?? item.raw.requestedArea} /></SpaceCardMetaValue>
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

                      <SpaceCardFooter />
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
                        disabled={savingId === item.id || editLoadingId === item.id}
                      >
                        <SquarePen size={15} strokeWidth={2.4} />
                        {editLoadingId === item.id ? "불러오는 중" : "수정"}
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
            </PageLoading>
          </SpaceInner>
        </SpacePage>
      </SpaceMain>

      {editingLand ? (
        <SpaceModalOverlay>
          <SpaceModal onSubmit={handleUpdateLand}>
            {/* 저장 중에는 닫기·취소·파일 선택을 포함한 모든 입력을 잠급니다. */}
            <fieldset disabled={Boolean(savingId)} aria-busy={Boolean(savingId)} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            {/* 내 토지 수정 모달 */}
            <SpaceModalHeader>
              <h2>토지 수정</h2>
              <SpaceModalClose type="button" onClick={() => setEditingLand(null)}>
                ×
              </SpaceModalClose>
            </SpaceModalHeader>

            <SpaceModalField>
              대표 이미지
              <SpaceModalImage $image={editImagePreview} />
              <SpaceModalFileButton type="button" onClick={() => setIsImageManagerOpen(true)}>
                이미지 수정
              </SpaceModalFileButton>
              <SpaceModalFileInput
                ref={editImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
              />
            </SpaceModalField>

            <SpaceModalField>
              주소
              {/* 등록된 도로명 주소는 확인과 복사만 가능하도록 읽기 전용으로 표시합니다. */}
              <SpaceModalInput
                value={editForm.address}
                readOnly
                aria-readonly="true"
                aria-describedby="readonly-address-note"
              />
              {/* 사용자가 주소를 수정할 수 없는 이유를 입력란 바로 아래에 안내합니다. */}
              <SpaceModalReadonlyNote id="readonly-address-note">
                도로명 주소는 토지 등록 후 수정할 수 없습니다.
              </SpaceModalReadonlyNote>
            </SpaceModalField>

            <SpaceModalField>
              거래 방식
              <SpaceModalSelect
                value={editForm.transactionType}
                onChange={handleEditChange("transactionType")}
              >
                <option value="SALE">매매</option>
                <option value="LEASE">임대</option>
                <option value="BUSINESS_HOPE">사업 희망</option>
              </SpaceModalSelect>
            </SpaceModalField>

            <SpaceModalField>
              희망 가격 (만원 단위)
              <SpaceModalInput
                value={editForm.transactionType === "BUSINESS_HOPE" ? "" : editForm.desiredPrice}
                onChange={handleEditChange("desiredPrice")}
                disabled={editForm.transactionType === "BUSINESS_HOPE"}
                aria-describedby={editForm.transactionType === "BUSINESS_HOPE" ? "business-hope-price-note" : undefined}
                placeholder={editForm.transactionType === "BUSINESS_HOPE" ? "가격 협의" : "예) 15,000"}
              />
              {/* 사업 희망은 가격을 저장하지 않는다는 점을 명확하게 안내합니다. */}
              {editForm.transactionType === "BUSINESS_HOPE" ? (
                <p id="business-hope-price-note">사업 희망은 가격을 입력하지 않습니다. 구체적인 조건은 사업자와 협의해 주세요.</p>
              ) : null}
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
            </fieldset>
          </SpaceModal>
        </SpaceModalOverlay>
      ) : null}

      {editingLand && isImageManagerOpen ? (
        // 토지 수정 폼과 분리된 상위 레이어에서 현재 등록 이미지를 관리합니다.
        <SpaceImageManagerOverlay>
          <SpaceImageManagerDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-manager-title"
            aria-describedby="image-manager-description"
          >
            <SpaceImageManagerHeader>
              <div>
                <h2 id="image-manager-title">이미지 관리</h2>
                <SpaceImageManagerDescription id="image-manager-description">
                  현재 등록되어 있는 토지 이미지입니다.
                </SpaceImageManagerDescription>
              </div>
              <SpaceImageManagerClose
                type="button"
                aria-label="이미지 관리 닫기"
                onClick={() => setIsImageManagerOpen(false)}
              >
                ×
              </SpaceImageManagerClose>
            </SpaceImageManagerHeader>

            {/* 이미지 수가 많아지면 목록 내부에서 가로로 스크롤합니다. */}
            {editImageUrls.length > 0 ? (
              <SpaceImageManagerList aria-label="등록 이미지 목록">
                {editImageUrls.map((imageUrl, index) => (
                  <SpaceImageManagerThumbnail key={`${imageUrl}-${index}`}>
                    <img src={imageUrl} alt={`등록 이미지 ${index + 1}`} />
                  </SpaceImageManagerThumbnail>
                ))}
              </SpaceImageManagerList>
            ) : (
              <SpaceImageManagerEmpty>현재 등록된 이미지가 없습니다.</SpaceImageManagerEmpty>
            )}

            {/* 이미지 API 수정 전까지 재업로드 UI는 파일 선택 동작을 연결하지 않습니다. */}
            <SpaceImageManagerUpload type="button">
              <Upload size={22} aria-hidden="true" />
              <span>이미지 재업로드</span>
            </SpaceImageManagerUpload>

            <SpaceImageManagerActions>
              <SpaceImageManagerButton type="button" onClick={() => setIsImageManagerOpen(false)}>
                취소
              </SpaceImageManagerButton>
              {/* 저장 API 연결 전까지 팝업만 닫습니다. */}
              <SpaceImageManagerButton type="button" $primary onClick={() => setIsImageManagerOpen(false)}>
                저장
              </SpaceImageManagerButton>
            </SpaceImageManagerActions>
          </SpaceImageManagerDialog>
        </SpaceImageManagerOverlay>
      ) : null}

      <Specific land={selectedLand} onClose={() => setSelectedLand(null)} />

      {landPendingDelete ? (
        <SpaceDeleteOverlay onMouseDown={(event) => {
          if (event.target === event.currentTarget && !deletingId) setLandPendingDelete(null);
        }}>
          <SpaceDeleteDialog role="alertdialog" aria-modal="true" aria-labelledby="delete-land-title" aria-describedby="delete-land-description">
            <SpaceDeleteIcon><AlertTriangle size={25} aria-hidden="true" /></SpaceDeleteIcon>
            <h2 id="delete-land-title">토지를 삭제하시겠습니까?</h2>
            <p id="delete-land-description">
              {landPendingDelete.address || landPendingDelete.title || "선택한 토지"}를 삭제하면 목록에서 사라집니다. 삭제를 진행하시겠습니까?
            </p>
            <SpaceDeleteActions>
              <SpaceActionButton type="button" $secondary autoFocus disabled={Boolean(deletingId)} onClick={() => setLandPendingDelete(null)}>
                취소
              </SpaceActionButton>
              <SpaceActionButton type="button" $danger disabled={Boolean(deletingId)} onClick={confirmDeleteLand}>
                <Trash2 size={15} aria-hidden="true" />
                {deletingId ? "삭제 중" : "삭제하기"}
              </SpaceActionButton>
            </SpaceDeleteActions>
          </SpaceDeleteDialog>
        </SpaceDeleteOverlay>
      ) : null}
    </SpaceWrapper>
  );
}

export default MySpace;
