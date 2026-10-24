import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import PageLoading from "@/components/ui/PageLoading/PageLoading";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import useHiddenPageScrollbar from "@/hooks/useHiddenPageScrollbar";
import BusinessCard from "./component/BusinessCard";
import BusinessDetail from "./component/BusinessDetail";
import LandSelectionModal from "./component/LandSelectionModal";
import { BusinessDescription, BusinessDivider, BusinessGrid, BusinessHeader,
  BusinessMain, BusinessPageRoot, BusinessTitle } from "./Business.styled";

function BusinessList({ token }) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [chatTarget, setChatTarget] = useState(null);
  const requestRef = useRef(0);

  // 계정 변경과 페이지 이탈 시 지연된 목록/상세 응답을 폐기합니다.
  useEffect(() => {
    let cancelled = false;
    if (token) void (async () => {
      try {
        const response = await authFetch(Api.BusinessProfiles);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.data?.message || "사업자 목록을 불러오지 못했습니다.");
        // 스웨거의 페이지 응답과 기존 배열 응답을 모두 목록으로 처리합니다.
        const pageData = data?.data ?? data;
        const profileList = Array.isArray(pageData)
          ? pageData
          : Array.isArray(pageData?.content)
            ? pageData.content
            : null;
        if (!profileList) throw new Error("사업자 목록 응답 형식이 올바르지 않습니다.");
        // 목록에 플랜이 없는 경우 상세 API에서 가져와 채팅 가능한 사업자만 남깁니다.
        const profilesWithPlan = await Promise.all(profileList.map(async (profile) => {
          if (profile.userPlan) return profile;
          try {
            const detailResponse = await authFetch(Api.BusinessProfileDetail(profile.id));
            if (!detailResponse.ok) throw new Error(`HTTP ${detailResponse.status}`);
            const detailData = await detailResponse.json();
            return { ...profile, ...(detailData?.data || {}) };
          } catch (detailError) {
            console.warn("[사업자 플랜 조회 실패]", { profileId: profile.id, error: detailError });
            return profile;
          }
        }));
        if (!cancelled && token === getValidAccessToken()) setProfiles(profilesWithPlan);
      } catch (err) { if (!cancelled) setError(err.message); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; requestRef.current += 1; };
  }, [token]);

  // 선택한 사업자의 최신 상세 프로필을 상세 API에서 조회합니다.
  const openDetail = async (profile) => {
    const id = profile.id;
    const request = ++requestRef.current;
    setDetailId(id); setDetail(null); setError("");
    try {
      const response = await authFetch(Api.BusinessProfileDetail(id));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.data?.message || "사업자 상세 정보를 불러오지 못했습니다.");
      // 목록 응답의 선택 정보는 보존하고 상세 응답을 우선 적용합니다.
      if (request === requestRef.current && token === getValidAccessToken()) {
        setDetail({ ...profile, ...(data.data || {}) });
      }
    } catch (err) { if (request === requestRef.current) setError(err.message); }
    finally { if (request === requestRef.current) setDetailId(null); }
  };
  const visibleProfiles = profiles.filter((profile) =>
    String(profile.userPlan || "").toUpperCase() === "BUSINESS"
    && `${profile.companyName || ""} ${(profile.mainFields || []).join(" ")}`.toLowerCase().includes(keyword.trim().toLowerCase()));

  return <BusinessPageRoot>
    <NavBar keyword={keyword} onChangeKeyword={setKeyword} onSearch={() => {}}
      isSuggestionOpen={false} regionSuggestions={[]} />
    <BusinessMain>
      <BusinessHeader>
        <BusinessTitle>사업 연결</BusinessTitle>
        <BusinessDescription>태양광 사업자의 전문 분야와 활동 지역을 확인해 보세요.</BusinessDescription>
        <BusinessDivider />
      </BusinessHeader>
      {/* 목록 또는 상세 정보를 요청하는 동안 기존 영역 위에 공통 로더를 표시합니다. */}
      <PageLoading isLoading={loading || detailId !== null}>
        {detail ? (
          // 선택한 사업자의 상세 정보만 표시하고 목록은 잠시 숨깁니다.
          <BusinessDetail profile={detail} onBack={() => setDetail(null)} onStartChat={() => setChatTarget(detail)} />
        ) : (
          <BusinessGrid>
            {!token ? <p>사업자 정보를 보려면 <Link to="/login">로그인</Link>해 주세요.</p> : null}
            {error ? <p role="alert">{error}</p> : null}
            {token && !loading && !error && visibleProfiles.length === 0 ? (
              <p>{keyword.trim() ? "검색어와 일치하는 사업자가 없습니다." : "현재 표시할 수 있는 사업자가 없습니다."}</p>
            ) : null}
            {/* 원래 카드 외형에 실제 API 데이터를 연결하며 사진이 없으면 기본 아이콘을 사용합니다. */}
            {visibleProfiles.map((profile) => <BusinessCard key={profile.id}
              business={{
                company: profile.companyName,
                department: profile.department,
                profileImage: profile.profileImagePath,
                specialty: (profile.mainFields || []).join(" · ") || "전문 분야 미등록",
                regions: profile.nationwideActive ? "전국" : (profile.activeRegions || []).join(" · ") || "활동 지역 미등록",
                isAvailable: profile.consultationAvailable,
                // 카드의 상담 가능 배지에 실제 시작·종료 시간을 전달합니다.
                consultationStartTime: profile.consultationStartTime,
                consultationEndTime: profile.consultationEndTime,
              }}
              isLoading={detailId === profile.id}
              onViewDetail={() => openDetail(profile)}
            />)}
          </BusinessGrid>
        )}
      </PageLoading>
    </BusinessMain>
    {chatTarget ? <LandSelectionModal
      business={chatTarget}
      onClose={() => setChatTarget(null)}
      onCreated={(room) => navigate("/chat", { state: { roomId: room.roomId, landId: room.landId } })}
    /> : null}
  </BusinessPageRoot>;
}

export default function BusinessPage() {
  // 사업 연결에서는 페이지 스크롤은 유지하고 스크롤바 UI만 숨깁니다.
  useHiddenPageScrollbar();
  const token = useAuthToken();
  return <BusinessList key={token || "anonymous"} token={token} />;
}
