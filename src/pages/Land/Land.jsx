import { useEffect, useState } from "react";
import SideBar from "@/components/layout/box/SideBar";
import NavBar from "@/components/layout/box/NavBar";
import LandAdd from "@/components/ui/LandButton/LandAdd";
import ImageUploadButton from "@/components/ui/ImageUploadButton";
import { Api } from "@/contents/apiEndpoints";
import useSidebarOpen from "@/hooks/useSidebarOpen";
import {
  authFetch,
  getFriendlyApiErrorMessage,
  getValidAccessToken,
} from "@/lib/auth";

import {
  LandAddButton,
  LandCard,
  LandCardBody,
  LandCardActions,
  LandDescription,
  LandGrid,
  LandInner,
  LandMain,
  LandEditButton,
  LandImageModal,
  LandImageModalClose,
  LandImageModalError,
  LandImageModalHeader,
  LandImageModalMeta,
  LandImageModalOverlay,
  LandImageModalSubmit,
  LandImageModalTitle,
  LandMeta,
  LandNavbarWrap,
  LandPage,
  LandScrollArea,
  LandShell,
  LandSidebarWrap,
  LandThumbImage,
  LandToolbar,
} from "./Land.styled";

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);
  return new Intl.NumberFormat("ko-KR").format(numeric);
};

const extractLandArray = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data,
    payload?.content,
    payload?.data?.content,
    payload?.result,
    payload?.data?.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

const normalizeLand = (land, index) => ({
  id: land.landId ?? land.id ?? `${land.address ?? "land"}-${index}`,
  address: land.address ?? "-",
  desiredPrice: land.desiredPrice ?? land.amount ?? land.price ?? null,
  area: land.area ?? null,
  status: land.status ?? "-",
  description: land.description ?? "-",
  landImagePath: land.landImagePath ?? "",
});

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

function Land() {
  const [keyword, setKeyword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useSidebarOpen();
  const [lands, setLands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageEditError, setImageEditError] = useState("");
  const sidebarWidth = sidebarOpen ? "180px" : "72px";
  const maxImageSizeBytes = 5 * 1024 * 1024;

  const fetchLands = async () => {
    setIsLoading(true);
    setError("");
    setIsFallback(false);

    try {
      const response = await authFetch(Api.Lands, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(
          data?.message || data?.data?.message || "토지 목록을 불러오지 못했습니다."
        );
      }

      if (response.redirected || response.url.includes("/oauth2/authorization/")) {
        throw new Error("로그인 페이지로 이동했습니다.");
      }

      const list = extractLandArray(data).map(normalizeLand);
      setLands(list);
    } catch (err) {
      setLands(fallbackLands);
      setIsFallback(true);
      setError("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  useEffect(() => {
    if (!editingLand) {
      setEditingImage(null);
      setImageEditError("");
      setIsEditingImage(false);
    }
  }, [editingLand]);

  const uploadLandImage = async (landId, file) => {
    const accessToken = getValidAccessToken();
    if (!accessToken) {
      throw new Error("로그인 후 이미지를 수정할 수 있습니다.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await authFetch(Api.LandImage(landId), {
      method: "PATCH",
      redirect: "manual",
      body: formData,
    });

    if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
      throw new Error("로그인이 필요하거나 인증이 만료됐어요. 다시 로그인해 주세요.");
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      throw new Error(
        data?.message || data?.data?.message || "토지 이미지를 수정하지 못했습니다."
      );
    }

    return data;
  };

  const handleOpenImageEdit = (land) => {
    setEditingLand(land);
    setEditingImage(null);
    setImageEditError("");
  };

  const handleCloseImageEdit = () => {
    setEditingLand(null);
  };

  const handleSubmitImageEdit = async () => {
    if (!editingLand) return;

    if (!editingImage) {
      setImageEditError("변경할 이미지를 선택해주세요.");
      return;
    }

    setIsEditingImage(true);
    setImageEditError("");

    try {
      await uploadLandImage(editingLand.id, editingImage);
      await fetchLands();
      handleCloseImageEdit();
    } catch (err) {
      setImageEditError(
        getFriendlyApiErrorMessage(err, "이미지를 수정하지 못했어요. 잠시 후 다시 시도해 주세요.")
      );
    } finally {
      setIsEditingImage(false);
    }
  };

  return (
    <LandShell>
      <LandNavbarWrap>
        <NavBar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSearch={() => {}}
          isSuggestionOpen={false}
          regionSuggestions={[]}
        />
      </LandNavbarWrap>

      <LandSidebarWrap>
        <SideBar expanded={sidebarOpen} />
      </LandSidebarWrap>

      <LandMain style={{ marginLeft: sidebarWidth, transition: "margin-left 0.3s" }}>
        <LandPage>
          <LandScrollArea>
            <LandInner>
              <LandToolbar>
                <LandAddButton type="button" onClick={() => setIsAddOpen(true)}>
                  토지등록하기
                </LandAddButton>
              </LandToolbar>

              {isLoading && <p style={{ margin: "0 0 16px", fontWeight: 700 }}>토지 목록을 불러오는 중입니다.</p>}
              {isFallback && !isLoading && (
                <p style={{ margin: "0 0 16px", color: "#8c6b00", fontWeight: 700 }}>
                  현재는 임시 데이터를 표시하고 있습니다.
                </p>
              )}
              {error && (
                <p style={{ margin: "0 0 16px", color: "#d92d20", fontWeight: 700 }}>
                  {error}
                </p>
              )}

              {!isLoading && !error && lands.length === 0 && (
                <p style={{ margin: "0 0 16px", fontWeight: 700 }}>등록된 토지가 없습니다.</p>
              )}

              <LandGrid>
                {lands.map((land, index) => (
                  <LandCard key={`${land.id}-${index}`}>
                    {land.landImagePath ? (
                      <LandThumbImage
                        src={resolveImageUrl(land.landImagePath)}
                        alt={land.address}
                        onError={(event) => {
                          event.currentTarget.removeAttribute("src");
                          event.currentTarget.style.background = "#f3f3f3";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          minHeight: "204px",
                          borderRadius: "10px",
                          border: "3px solid #222",
                          background: "#f3f3f3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#6b7280",
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        이미지 없음
                      </div>
                    )}

                    <LandCardBody>
                      <LandMeta>
                        <div>
                          주소: <strong>{land.address}</strong>
                        </div>
                        <div>
                          금액: <strong>{formatMoney(land.desiredPrice)}</strong>
                        </div>
                        <div>
                          {land.area ? (
                            <>
                              면적: <strong>{land.area}㎡</strong>
                            </>
                          ) : (
                            <>
                              상태: <strong>{land.status}</strong>
                            </>
                          )}
                        </div>
                      </LandMeta>

                      <LandDescription>설명: {land.description}</LandDescription>

                      <LandCardActions>
                        <LandEditButton type="button" onClick={() => handleOpenImageEdit(land)}>
                          이미지 수정
                        </LandEditButton>
                      </LandCardActions>
                    </LandCardBody>
                  </LandCard>
                ))}
              </LandGrid>
            </LandInner>
          </LandScrollArea>
        </LandPage>
      </LandMain>

      <LandAdd
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={async () => {
          setIsAddOpen(false);
          await fetchLands();
        }}
      />

      {editingLand && (
        <LandImageModalOverlay role="dialog" aria-modal="true" aria-label="토지 이미지 수정">
          <LandImageModal>
            <LandImageModalHeader>
              <LandImageModalTitle>이미지 수정</LandImageModalTitle>
              <LandImageModalClose type="button" onClick={handleCloseImageEdit} aria-label="닫기">
                X
              </LandImageModalClose>
            </LandImageModalHeader>

            <LandImageModalMeta>
              {editingLand.address}
            </LandImageModalMeta>

            <ImageUploadButton
              label="변경할 이미지"
              placeholder="이미지를 선택해주세요"
              helperText="jpg, png, webp, gif 허용"
              selectedFileName={editingImage?.name || ""}
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={isEditingImage}
              showLaterButton={false}
              onFileSelect={(file) => {
                if (file && file.size > maxImageSizeBytes) {
                  setEditingImage(null);
                  setImageEditError("이미지가 너무 큽니다. 5MB 이하로 선택해주세요.");
                  return;
                }

                setEditingImage(file);
                setImageEditError("");
              }}
            />

            {imageEditError && <LandImageModalError>{imageEditError}</LandImageModalError>}

            <LandImageModalSubmit type="button" onClick={handleSubmitImageEdit} disabled={isEditingImage}>
              {isEditingImage ? "수정 중..." : "이미지 수정"}
            </LandImageModalSubmit>
          </LandImageModal>
        </LandImageModalOverlay>
      )}
    </LandShell>
  );
}

export default Land;
