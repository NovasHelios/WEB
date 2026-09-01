import { useEffect, useState } from "react";
import NavBar from "@/components/layout/box/NavBar";
import LandAdd from "@/components/ui/LandButton/LandAdd";
import { Api } from "@/contents/apiEndpoints";
import useSidebarOpen from "@/hooks/useSidebarOpen";
import { authFetch } from "@/lib/auth";

import {
  LandAddButton,
  LandCard,
  LandCardBody,
  LandDescription,
  LandGrid,
  LandInner,
  LandMain,
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
  const sidebarWidth = sidebarOpen ? "180px" : "72px";

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
                      />
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

    </LandShell>
  );
}

export default Land;
