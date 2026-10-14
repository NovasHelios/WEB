import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import BusinessCard from "./component/BusinessCard";
import BusinessDetail from "./component/BusinessDetail";
import { BusinessDescription, BusinessDivider, BusinessGrid, BusinessHeader,
  BusinessMain, BusinessPageRoot, BusinessTitle } from "./Business.styled";

function BusinessList({ token }) {
  const [keyword, setKeyword] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const requestRef = useRef(0);

  // 계정 변경과 페이지 이탈 시 지연된 목록/상세 응답을 폐기합니다.
  useEffect(() => {
    let cancelled = false;
    if (token) void (async () => {
      try {
        const response = await authFetch(Api.BusinessProfiles);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.data?.message || "사업자 목록을 불러오지 못했습니다.");
        if (!cancelled && token === getValidAccessToken()) setProfiles(Array.isArray(data.data) ? data.data : []);
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
    `${profile.companyName || ""} ${(profile.mainFields || []).join(" ")}`.toLowerCase().includes(keyword.trim().toLowerCase()));

  return <BusinessPageRoot>
    <NavBar keyword={keyword} onChangeKeyword={setKeyword} onSearch={() => {}}
      isSuggestionOpen={false} regionSuggestions={[]} />
    <BusinessMain>
      <BusinessHeader>
        <BusinessTitle>사업 연결</BusinessTitle>
        <BusinessDescription>태양광 사업자의 전문 분야와 활동 지역을 확인해 보세요.</BusinessDescription>
        <BusinessDivider />
      </BusinessHeader>
      {detail ? (
        // 선택한 사업자의 상세 정보만 표시하고 목록은 잠시 숨깁니다.
        <BusinessDetail profile={detail} onBack={() => setDetail(null)} />
      ) : (
        <BusinessGrid>
          {!token ? <p>사업자 정보를 보려면 <Link to="/login">로그인</Link>해 주세요.</p> : null}
          {loading ? <p role="status">사업자 목록을 불러오는 중입니다.</p> : null}
          {error ? <p role="alert">{error}</p> : null}
          {token && !loading && !error && visibleProfiles.length === 0 ? <p>검색 조건에 맞는 사업자가 없습니다.</p> : null}
          {/* 원래 카드 외형에 실제 API 데이터를 연결하며 사진이 없으면 기본 아이콘을 사용합니다. */}
          {visibleProfiles.map((profile) => <BusinessCard key={profile.id}
            business={{
              company: profile.companyName,
              department: profile.department,
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
    </BusinessMain>
  </BusinessPageRoot>;
}

export default function BusinessPage() {
  const token = useAuthToken();
  return <BusinessList key={token || "anonymous"} token={token} />;
}
