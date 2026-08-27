import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  FileText,
  ImagePlus,
  Map as MapIcon,
  FileType,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RegisterPageHeader, RegisterWorkflowSidebar } from "../shared";
import {
  PhotosCard,
  PhotosCardHeader,
  PhotosCardLabel,
  PhotosCardRow,
  PhotosCardSubtext,
  PhotosCardTitle,
  PhotosDocAction,
  PhotosDocBadge,
  PhotosDocIcon,
  PhotosDocInputRow,
  PhotosDocName,
  PhotosDocRow,
  PhotosDocShell,
  PhotosDocSize,
  PhotosDocStatus,
  PhotosDocText,
  PhotosDocTitle,
  PhotosDropbox,
  PhotosDropboxHint,
  PhotosDropboxIcon,
  PhotosFooterNote,
  PhotosFooterNoteIcon,
  PhotosPage,
  PhotosSection,
  PhotosThumb,
  PhotosThumbBadge,
  PhotosThumbGrid,
  PhotosThumbPlaceholder,
  PhotosThumbText,
  PhotosTopShell,
  PhotosUploadCaption,
} from "./LandRegisterPhotos.styled";
import {
  RegisterButtonRow as PhotosBottomButtons,
  RegisterPrimaryButton as PhotosPrimaryButton,
  RegisterSectionDescription as PhotosSectionDescription,
  RegisterSectionTitle as PhotosSectionTitle,
} from "../shared.styled";

const photoSlots = [
  { label: "대표 사진", note: "선택" },
  { label: "사진 2", note: "선택" },
  { label: "사진 3", note: "선택" },
];

const documentSlots = [
  {
    title: "등기부등본",
    subtitle: "최근 3개월 이내 발급본",
    fileName: "",
    size: "",
    filled: false,
  },
  {
    title: "토지대장",
    subtitle: "최근 3개월 이내 발급본",
    fileName: "",
    size: "",
    filled: false,
  },
  {
    title: "지적도",
    subtitle: "최근 3개월 이내 발급본",
    fileName: "파일 선택",
    size: "",
    filled: false,
  },
  {
    title: "기타 서류",
    subtitle: "토지 관련 추가 서류가 있다면 업로드해주세요.",
    fileName: "파일 선택",
    size: "",
    filled: false,
  },
];

function LandRegisterPhotos() {
  const navigate = useNavigate();

  return (
    <PhotosPage>
      {/* 공통 헤더 */}
      <RegisterPageHeader />

      {/* 사진과 서류 업로드 영역 */}
      <PhotosTopShell>
        <PhotosSection>
          <PhotosSectionTitle>4. 사진 및 서류</PhotosSectionTitle>
          <PhotosSectionDescription>
            토지의 현황을 확인할 수 있는 사진과 서류를 업로드해주세요. 사진은 선택 입력으로 두어 지금은 비워두셔도 됩니다.
          </PhotosSectionDescription>
        </PhotosSection>

        <PhotosCard>
          <PhotosCardTitle>토지 사진</PhotosCardTitle>
          <PhotosCardLabel>토지 사진(최대 10장)</PhotosCardLabel>
          <PhotosCardRow>
            <PhotosThumbGrid>
              {photoSlots.map((slot, index) => (
                <PhotosThumb key={slot.label}>
                  {index === 0 ? <PhotosThumbBadge>대표 사진</PhotosThumbBadge> : null}
                  <PhotosThumbPlaceholder>
                    <ImagePlus size={24} strokeWidth={2} />
                    <PhotosThumbText>{slot.label}</PhotosThumbText>
                    <PhotosThumbText>{slot.note}</PhotosThumbText>
                  </PhotosThumbPlaceholder>
                </PhotosThumb>
              ))}

              <PhotosDropbox>
                <PhotosDropboxIcon>
                  <ImagePlus size={22} strokeWidth={2} />
                </PhotosDropboxIcon>
                <PhotosDropboxHint>사진 추가</PhotosDropboxHint>
              </PhotosDropbox>
            </PhotosThumbGrid>

            <PhotosUploadCaption>* JPG, PNG 파일만 가능 (최대 10MB)</PhotosUploadCaption>
          </PhotosCardRow>
        </PhotosCard>

        <PhotosCard>
          <PhotosCardHeader>
            <PhotosCardTitle>토지 증명서 및 서류</PhotosCardTitle>
            <PhotosCardSubtext>토지 관련 증명서 및 서류를 업로드해주세요.</PhotosCardSubtext>
          </PhotosCardHeader>

          <PhotosDocShell>
            {documentSlots.map((doc) => (
              <PhotosDocRow key={doc.title}>
                <PhotosDocIcon>
                  {doc.title === "지적도" ? <MapIcon size={18} strokeWidth={2} /> : doc.title === "기타 서류" ? <FileType size={18} strokeWidth={2} /> : <FileText size={18} strokeWidth={2} />}
                </PhotosDocIcon>

                <PhotosDocInputRow>
                  <PhotosDocTitle>
                    {doc.title} <PhotosDocBadge>선택</PhotosDocBadge>
                  </PhotosDocTitle>
                  <PhotosDocText>{doc.subtitle}</PhotosDocText>
                  <PhotosDocName>{doc.fileName || "아직 선택되지 않았습니다."}</PhotosDocName>
                </PhotosDocInputRow>

                <PhotosDocAction type="button">{doc.filled ? "업로드됨" : "파일 선택"}</PhotosDocAction>

                {doc.size ? <PhotosDocSize>{doc.size}</PhotosDocSize> : <PhotosDocStatus>선택 입력</PhotosDocStatus>}
              </PhotosDocRow>
            ))}
          </PhotosDocShell>
        </PhotosCard>

        <PhotosFooterNote>
          <PhotosFooterNoteIcon>
            <AlertTriangle size={14} strokeWidth={2.6} />
          </PhotosFooterNoteIcon>
          자동으로 조회된 정보입니다. 공공데이터와 사용자 입력정보를 기반으로 한 사전 분석 결과이며 실제 사업 가능 여부와 차이가 발생할 수 있습니다.
        </PhotosFooterNote>

        <PhotosBottomButtons>
          <PhotosPrimaryButton type="button" $outline onClick={() => navigate("/land/register/detail")}>
            <ArrowLeft size={18} strokeWidth={2.4} />
            이전 단계로
          </PhotosPrimaryButton>
          <PhotosPrimaryButton type="button" onClick={() => navigate("/land/register/condition")}>
            다음 단계로
            <ChevronRight size={18} strokeWidth={2.4} />
          </PhotosPrimaryButton>
        </PhotosBottomButtons>
      </PhotosTopShell>

      {/* 진행 단계 사이드바 */}
      <RegisterWorkflowSidebar activeStep={4} />
    </PhotosPage>
  );
}

export default LandRegisterPhotos;
