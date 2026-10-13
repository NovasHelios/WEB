import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NavBar from "@/components/layout/box/NavBar";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import BusinessCard from "./component/BusinessCard";
import { BusinessDescription, BusinessDivider, BusinessGrid, BusinessHeader,
  BusinessMain, BusinessPageRoot, BusinessTitle } from "./Business.styled";

// 실제 사업자 API에 있는 회사 정보만 표시하고 임의의 이름·사진은 만들지 않습니다.
const ProfileCard = styled.article`
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  overflow-wrap: anywhere;
  h2 { font-size: var(--font-xl); margin-bottom: 1rem; }
  p { margin-bottom: 0.75rem; white-space: pre-wrap; }
  button, a {
    display: inline-block; margin-top: 0.75rem; padding: 0.625rem 1rem;
    border: 1px solid var(--color-brand-dark); border-radius: 0.5rem;
    color: var(--color-brand-dark);
  }
  button:disabled { opacity: 0.6; cursor: wait; }
  button:focus-visible, a:focus-visible { outline: 2px solid var(--color-brand-dark); outline-offset: 3px; }
`;

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

  const openDetail = async (id) => {
    const request = ++requestRef.current;
    setDetailId(id); setDetail(null); setError("");
    try {
      const response = await authFetch(Api.BusinessProfileDetail(id));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.data?.message || "사업자 상세 정보를 불러오지 못했습니다.");
      if (request === requestRef.current && token === getValidAccessToken()) setDetail(data.data);
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
          }}
          isLoading={detailId === profile.id}
          onViewDetail={() => openDetail(profile.id)}
        />)}
      </BusinessGrid>
      {detail ? <ProfileCard aria-label="사업자 상세 정보" style={{ marginTop: "2rem" }}>
        <h2>{detail.companyName}</h2>
        <p>{detail.mainFieldDescription || "전문 분야 소개가 없습니다."}</p>
        <p>{detail.businessDescription || "사업자 소개가 없습니다."}</p>
        <p>사업자 인증: {detail.businessVerified ? "완료" : "미확인"}</p>
        <p>상담 시간: {detail.consultationAvailable ? `${detail.consultationStartTime || "미등록"} ~ ${detail.consultationEndTime || "미등록"}` : "상담 불가"}</p>
        {/* 현재 API는 사업자에서 토지 소유자로 상담을 요청하는 흐름만 제공합니다. */}
        <p>이 사업자에게 직접 상담을 요청하는 기능은 아직 지원하지 않습니다. 기존 상담은 채팅에서 확인할 수 있습니다.</p>
        <Link to="/chat">내 채팅 보기</Link>{" "}
        <button type="button" onClick={() => setDetail(null)}>상세 닫기</button>
      </ProfileCard> : null}
    </BusinessMain>
  </BusinessPageRoot>;
}

export default function BusinessPage() {
  const token = useAuthToken();
  return <BusinessList key={token || "anonymous"} token={token} />;
}
