// 기본 정보에 사용할 위치 및 다운로드 아이콘입니다.
import { Download, MapPin } from "lucide-react";

// 기본 정보 스타일은 Preview 공통 스타일 파일에서 가져옵니다.
import {
  AddressBox,
  AddressLabel,
  AddressText,
  AttachmentDownload,
  AttachmentInfo,
  AttachmentItem,
  AttachmentList,
  AttachmentName,
  AttachmentSection,
  AttachmentTitle,
  BasicInfoContent,
  BasicInfoHeader,
  BasicInfoList,
  BasicInfoRow,
  BasicInfoTitle,
  InfoLabel,
  InfoValue,
  ReferenceDate,
  TransactionBadge,
  UnsupportedValue,
} from "../Preview.styeld";

// 아직 서버에서 전달받지 못한 정보에 표시할 문구입니다.
const UNSUPPORTED_TEXT = "아직 지원하지 않는 기능입니다";

// 서버 날짜를 디자인의 YYYY. MM. DD 형식으로 변경합니다.
const formatDate = (value) => {
  // 날짜 값이 없으면 지원하지 않는 정보로 처리합니다.
  if (!value) return "";

  // 날짜의 연, 월, 일 부분만 분리합니다.
  const [year, month, day] = String(value).slice(0, 10).split("-");

  // 정상적인 날짜 형식이 아니면 서버 값을 그대로 반환합니다.
  if (!year || !month || !day) return String(value);

  // 디자인에 맞는 날짜 형식으로 반환합니다.
  return `${year}. ${month}. ${day}`;
};

// 서버 거래 유형을 화면에 표시할 한글로 변경합니다.
const formatTransactionType = (value) => {
  // 서버 거래 유형별 화면 표시값입니다.
  const transactionLabels = {
    SALE: "매매",
    LEASE: "임대",
    MONTHLY_RENT: "월세",
    SHORT_TERM: "단기임대",
  };

  // 등록된 변환값이 없으면 서버 값을 그대로 사용합니다.
  return transactionLabels[value] || value || UNSUPPORTED_TEXT;
};

// 첨부 파일 경로를 다운로드 가능한 주소로 변경합니다.
const resolveDocumentUrl = (path) => {
  // 첨부 파일 경로가 없으면 빈 값을 반환합니다.
  if (!path) return "";

  // 이미 완성된 URL이면 그대로 사용합니다.
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // 환경변수가 없으면 현재 백엔드 주소를 사용합니다.
  const baseUrl = (
    import.meta.env.VITE_API_BASE_URL || "https://api.helioss.site"
  ).replace(/\/$/, "");

  // 상대경로 앞의 중복 슬래시를 제거한 뒤 서버 주소와 연결합니다.
  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
};

// 첨부 파일 경로에서 실제 파일명을 가져옵니다.
const getDocumentName = (path) => {
  // 경로의 마지막 부분을 파일명으로 사용합니다.
  const fileName = String(path).split("/").pop();

  // 파일명이 없으면 기본 문구를 반환합니다.
  if (!fileName) return "첨부 서류";

  try {
    // 정상적으로 URL 인코딩된 한글 파일명을 복원합니다.
    return decodeURIComponent(fileName);
  } catch {
    // 잘못된 퍼센트 인코딩이 포함된 파일명은 원본 그대로 표시합니다.
    return fileName;
  }
};

// 토지의 기본 정보를 표시하는 탭 콘텐츠입니다.
function BasicInfo({
  land,
  address,
  category,
  transactionType,
  formattedArea,
  formattedPrice,
}) {
  // 기준일과 등록일에 사용할 서버 날짜입니다.
  const referenceDate = formatDate(land?.lastUpdtDt);

  // 단일 또는 배열 형태의 첨부 파일 경로를 배열로 정규화합니다.
  const documentPaths = (
    Array.isArray(land?.documentPath) ? land.documentPath : [land?.documentPath]
  ).filter((path) => typeof path === "string" && path.trim());

  return (
    // 기본 정보 탭의 전체 콘텐츠입니다.
    <BasicInfoContent>
      {/* 기본 정보 제목과 기준일입니다. */}
      <BasicInfoHeader>
        <BasicInfoTitle>기본 정보</BasicInfoTitle>

        <ReferenceDate>
          기준일: {referenceDate || UNSUPPORTED_TEXT}
        </ReferenceDate>
      </BasicInfoHeader>

      {/* 토지 주소를 강조해서 표시합니다. */}
      <AddressBox>
        <div>
          <AddressLabel>주소 / 소재지</AddressLabel>
          <AddressText>{address}</AddressText>
        </div>

        <MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
      </AddressBox>

      {/* 토지의 세부 정보 목록입니다. */}
      <BasicInfoList>
        <BasicInfoRow>
          <InfoLabel>지목</InfoLabel>
          <InfoValue>{category}</InfoValue>
        </BasicInfoRow>

        <BasicInfoRow>
          <InfoLabel>용도 지역</InfoLabel>
          {/* 필터 API가 전달하는 용도 지역명을 표시합니다. */}
          {land?.prposAreaName ? (
            <InfoValue>{land.prposAreaName}</InfoValue>
          ) : (
            <UnsupportedValue>{UNSUPPORTED_TEXT}</UnsupportedValue>
          )}
        </BasicInfoRow>

        <BasicInfoRow>
          <InfoLabel>총 면적</InfoLabel>
          <InfoValue>{formattedArea}</InfoValue>
        </BasicInfoRow>

        <BasicInfoRow>
          <InfoLabel>거래 형태</InfoLabel>
          <TransactionBadge>
            {formatTransactionType(transactionType)}
          </TransactionBadge>
        </BasicInfoRow>

        <BasicInfoRow>
          <InfoLabel>희망 가격</InfoLabel>
          <InfoValue $price>{formattedPrice}</InfoValue>
        </BasicInfoRow>

        <BasicInfoRow>
          <InfoLabel>등록일</InfoLabel>
          {referenceDate ? (
            <InfoValue>{referenceDate}</InfoValue>
          ) : (
            <UnsupportedValue>{UNSUPPORTED_TEXT}</UnsupportedValue>
          )}
        </BasicInfoRow>

        <BasicInfoRow>
          <InfoLabel>경사도 (DEM)</InfoLabel>
          <UnsupportedValue>{UNSUPPORTED_TEXT}</UnsupportedValue>
        </BasicInfoRow>
      </BasicInfoList>

      {/* 서버에서 받은 첨부 서류 목록입니다. */}
      <AttachmentSection>
        <AttachmentTitle>첨부 서류</AttachmentTitle>

        {documentPaths.length > 0 ? (
          <AttachmentList>
            {documentPaths.map((path, index) => (
              <AttachmentItem key={`${path}-${index}`}>
                <AttachmentInfo>
                  <span>PDF</span>

                  <div>
                    <AttachmentName>{getDocumentName(path)}</AttachmentName>
                    <small>첨부 파일</small>
                  </div>
                </AttachmentInfo>

                <AttachmentDownload
                  href={resolveDocumentUrl(path)}
                  download
                  aria-label={`${getDocumentName(path)} 다운로드`}
                >
                  <Download size={16} strokeWidth={1.8} />
                </AttachmentDownload>
              </AttachmentItem>
            ))}
          </AttachmentList>
        ) : (
          <UnsupportedValue>{UNSUPPORTED_TEXT}</UnsupportedValue>
        )}
      </AttachmentSection>
    </BasicInfoContent>
  );
}

export default BasicInfo;
