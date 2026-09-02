import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  FileText,
  ImagePlus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import { RegisterWorkflowSidebar, useRequireLogin } from "../shared";
import { useLandRegister } from "@/contexts/LandRegisterContext";
import {
  PhotosCard,
  PhotosCardHeader,
  PhotosCardLabel,
  PhotosCardRow,
  PhotosCardSubtext,
  PhotosCardTitle,
  PhotosDocAction,
  PhotosDocIcon,
  PhotosDocInputRow,
  PhotosDocName,
  PhotosDocRow,
  PhotosDocShell,
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
  PhotosTopShell,
  PhotosUploadCaption,
} from "./LandRegisterPhotos.styled";
import {
  RegisterButtonRow as PhotosBottomButtons,
  RegisterPrimaryButton as PhotosPrimaryButton,
  RegisterSectionDescription as PhotosSectionDescription,
  RegisterSectionTitle as PhotosSectionTitle,
} from "../shared.styled";

const MAX_IMAGES = 5;
const MIN_IMAGES = 3;

function LandRegisterPhotos() {
  const navigate = useNavigate();
  useRequireLogin();
  const { registerData, setRegisterData } = useLandRegister();

  const [images, setImages] = useState(registerData.photos || []); // { file: File, preview: DataURL }[]
  const [document, setDocument] = useState(registerData.document || null); // File | null
  const [error, setError] = useState("");

  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // 이미지 선택 처리
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);

    Promise.all(
      toAdd.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({ file, preview: e.target.result });
          };
          reader.readAsDataURL(file);
        });
      })
    ).then((newImages) => {
      setImages((prev) => {
        const nextImages = [...prev, ...newImages];
        setRegisterData((prevData) => ({ ...prevData, photos: nextImages }));
        return nextImages;
      });
    });

    event.target.value = "";
  };

  // 이미지 제거
  const removeImage = (index) => {
    setImages((prev) => {
      const nextImages = prev.filter((_, i) => i !== index);
      setRegisterData((prevData) => ({ ...prevData, photos: nextImages }));
      return nextImages;
    });
  };

  // 서류 선택
  const handleDocumentSelect = (event) => {
    const file = event.target.files?.[0] ?? null;
    setDocument(file);
    setRegisterData((prev) => ({ ...prev, document: file }));
    event.target.value = "";
  };

  // 서류 제거
  const removeDocument = () => {
    setDocument(null);
    setRegisterData((prev) => ({ ...prev, document: null }));
  };

  const handleNext = () => {
    // 사진과 서류는 마지막 조건 단계에서 한 번에 전송하기 위해 전역 상태에 저장합니다.
    if (images.length < MIN_IMAGES) {
      setError(`이미지를 최소 ${MIN_IMAGES}장 이상 선택해주세요.`);
      return;
    }

    // registerData에서 address가 있는지 확인
    if (!registerData.address) {
      setError("주소를 먼저 입력해주세요.");
      return;
    }

    setError("");
    setRegisterData((prev) => ({ ...prev, photos: images, document }));
    navigate("/land/register/condition");
  };

  return (
    <PhotosPage>
      {/* 공통 헤더 */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      {/* 사진과 서류 업로드 영역 */}
      <PhotosTopShell>
        <PhotosSection>
          <PhotosSectionTitle>4. 사진 및 서류</PhotosSectionTitle>
          <PhotosSectionDescription>
            토지의 현황을 확인할 수 있는 사진(최소 3장)과 서류를 업로드해주세요.
          </PhotosSectionDescription>
        </PhotosSection>

        {/* 토지 사진 업로드 */}
        <PhotosCard>
          <PhotosCardTitle>토지 사진</PhotosCardTitle>
          <PhotosCardLabel>토지 사진 ({images.length}/{MAX_IMAGES})</PhotosCardLabel>
          <PhotosCardRow>
            <PhotosThumbGrid>
              {images.map((img, index) => (
                <PhotosThumb key={index} style={{ position: "relative" }}>
                  {index === 0 && <PhotosThumbBadge>대표 사진</PhotosThumbBadge>}
                  <img
                    src={img.preview}
                    alt={`토지 사진 ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: 0,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </PhotosThumb>
              ))}

              {images.length < MAX_IMAGES && (
                <PhotosDropbox
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <PhotosDropboxIcon>
                    <ImagePlus size={22} strokeWidth={2} />
                  </PhotosDropboxIcon>
                  <PhotosDropboxHint>사진 추가</PhotosDropboxHint>
                </PhotosDropbox>
              )}
            </PhotosThumbGrid>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <PhotosUploadCaption>
                * jpg, png, webp, gif 파일 가능
              </PhotosUploadCaption>
              <PhotosUploadCaption>
                * 최소 {MIN_IMAGES}장 ~ 최대 {MAX_IMAGES}장 필수
              </PhotosUploadCaption>
              {images.length < MIN_IMAGES && (
                <p style={{ color: "#d92d20", fontSize: "14px", margin: 0 }}>
                  ⚠️ 최소 {MIN_IMAGES}장을 업로드해야 합니다.
                </p>
              )}
            </div>
          </PhotosCardRow>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
        </PhotosCard>

        {/* 서류 첨부 (선택) */}
        <PhotosCard>
          <PhotosCardHeader>
            <PhotosCardTitle>서류 첨부 (선택)</PhotosCardTitle>
            <PhotosCardSubtext>토지 관련 증명서 또는 추가 서류가 있으면 업로드해주세요.</PhotosCardSubtext>
          </PhotosCardHeader>

          <PhotosDocShell style={{ gridTemplateColumns: "1fr" }}>
            <PhotosDocRow>
              <PhotosDocIcon>
                <FileText size={18} strokeWidth={2} />
              </PhotosDocIcon>

              <PhotosDocInputRow>
                <PhotosDocTitle>추가 서류</PhotosDocTitle>
                <PhotosDocText>토지 관련 서류 (등기부등본, 토지대장, 지적도 등)</PhotosDocText>
                <PhotosDocName>
                  {document ? document.name : "아직 선택되지 않았습니다."}
                </PhotosDocName>
              </PhotosDocInputRow>

              {document ? (
                <button
                  type="button"
                  onClick={removeDocument}
                  style={{
                    border: 0,
                    background: "#d92d20",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  제거
                </button>
              ) : (
                <PhotosDocAction
                  type="button"
                  onClick={() => documentInputRef.current?.click()}
                >
                  파일 선택
                </PhotosDocAction>
              )}
            </PhotosDocRow>
          </PhotosDocShell>

          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.hwp,image/*"
            onChange={handleDocumentSelect}
            style={{ display: "none" }}
          />
        </PhotosCard>

        {error && (
          <div style={{ color: "#d92d20", fontSize: "14px", padding: "12px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <PhotosFooterNote>
          <PhotosFooterNoteIcon>
            <AlertTriangle size={14} strokeWidth={2.6} />
          </PhotosFooterNoteIcon>
          등록된 토지는 관리자 심사 후 공개됩니다. 부정확한 정보 제공 시 승인이 거절될 수 있습니다.
        </PhotosFooterNote>

        <PhotosBottomButtons>
          <PhotosPrimaryButton
            type="button"
            $outline
            onClick={() => navigate("/land/register/detail")}
          >
            <ArrowLeft size={18} strokeWidth={2.4} />
            이전 단계로
          </PhotosPrimaryButton>
          <PhotosPrimaryButton
            type="button"
            onClick={handleNext}
            disabled={images.length < MIN_IMAGES}
          >
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
