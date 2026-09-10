import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import { Api } from "@/contents/apiEndpoints";
import {
  authFetch,
  clearAccessToken,
  getValidAccessToken,
} from "@/lib/auth";
import {
  ProfileActions,
  ProfileAvatar,
  ProfileAvatarPanel,
  ProfileButton,
  ProfileCard,
  ProfileDialog,
  ProfileDialogActions,
  ProfileDialogBackdrop,
  ProfileDialogHeader,
  ProfileField,
  ProfileForm,
  ProfileHeader,
  ProfileImageButton,
  ProfileInput,
  ProfileMessage,
  ProfilePage,
  ProfileShell,
} from "./Profile.styles";

const normalizeBaseUrl = (value) => {
  // 서버 이미지 경로를 절대 경로로 만들기 위한 기본 주소입니다.
  const rawValue = value || "https://www.helioss.site";
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }
  return `https://${rawValue.replace(/\/$/, "")}`;
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const resolveImageUrl = (path, cacheKey = "") => {
  // 프로필 이미지가 없으면 기본 이니셜 UI를 사용합니다.
  if (!path) return "";

  const normalizedPath = String(path).replace(/^\/+/, "");

  const resolvedPath = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : normalizedPath.startsWith("uploads/profiles/")
      ? `${API_BASE_URL}/${normalizedPath}`
      : `${API_BASE_URL}/uploads/profiles/${normalizedPath}`;

  // 같은 이미지 URL이 재사용될 때 브라우저 캐시를 우회합니다.
  if (!cacheKey) return resolvedPath;

  const separator = resolvedPath.includes("?") ? "&" : "?";
  return `${resolvedPath}${separator}v=${cacheKey}`;
};

const getProfileImagePath = (user) => {
  // 서버 프로필 이미지 필드명이 달라도 실제 이미지 경로를 찾습니다.
  return (
    user?.profileImagePath ||
    user?.profileImageUrl ||
    user?.imagePath ||
    user?.imageUrl ||
    user?.profileImage ||
    user?.url ||
    user?.path ||
    ""
  );
};

const formatPhoneNumber = (value) => {
  // 전화번호는 숫자만 추출한 뒤 휴대폰 번호 형식으로 표시합니다.
  const digits = String(value || "").replace(/[^\d]/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

function Profile() {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    phone: "",
    role: "",
    profileImagePath: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({ phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      // 프로필은 로그인한 사용자만 접근할 수 있습니다.
      if (!getValidAccessToken()) {
        navigate("/login", { replace: true });
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await authFetch(Api.MyProfile, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await response.json() : null;

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login", { replace: true });
            return;
          }
          throw new Error(data?.message || data?.data?.message || "프로필 정보를 불러오지 못했습니다.");
        }

        const user = data?.data || {};
        const profileImagePath = getProfileImagePath(user);
        setProfile({
          email: user.email || "",
          name: user.name || "",
          phone: formatPhoneNumber(user.phone),
          role: user.role || "",
          profileImagePath,
        });
        setPreviewImage(resolveImageUrl(profileImagePath));
      } catch (err) {
        setError(err.message || "프로필 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    // 페이지 진입 시 내 프로필 정보를 조회합니다.
    void fetchProfile();
  }, [navigate]);

  const handleEditChange = (field) => (event) => {
    // 팝업 안에서만 수정용 프로필 입력값을 변경합니다.
    const nextValue = field === "phone" ? formatPhoneNumber(event.target.value) : event.target.value;
    setEditProfile((prev) => ({ ...prev, [field]: nextValue }));
    setMessage("");
    setError("");
  };

  const handleOpenEdit = () => {
    // 현재 프로필 값을 수정 팝업의 초기값으로 복사합니다.
    setEditProfile({
      phone: profile.phone,
    });
    setMessage("");
    setError("");
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    // 저장 중에는 중복 동작을 막기 위해 팝업을 닫지 않습니다.
    if (isSaving) return;
    setIsEditOpen(false);
    setEditProfile({ phone: "" });
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editProfile.phone.trim()) {
      setError("휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await authFetch(Api.MyProfile, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatPhoneNumber(editProfile.phone),
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "프로필 수정에 실패했습니다.");
      }

      const nextProfile = {
        phone: formatPhoneNumber(editProfile.phone),
      };

      setProfile((prev) => ({ ...prev, ...nextProfile }));
      setIsEditOpen(false);
      setMessage("프로필이 저장되었습니다.");
    } catch (err) {
      setError(err.message || "프로필 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (event) => {
    // 선택한 프로필 이미지를 서버에 업로드합니다.
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await authFetch(Api.MyProfileImage, {
        method: "PATCH",
        body: formData,
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "프로필 이미지 수정에 실패했습니다.");
      }

      const user = data?.data || data || {};
      const profileImagePath = getProfileImagePath(user);

      if (profileImagePath) {
        // 서버에 저장된 새 이미지 경로를 기준으로 화면을 갱신합니다.
        setProfile((prev) => ({ ...prev, profileImagePath }));
        setPreviewImage(resolveImageUrl(profileImagePath, Date.now()));
      } else {
        // 서버가 이미지 경로를 내려주지 않으면 로컬 미리보기로 즉시 갱신합니다.
        setPreviewImage(URL.createObjectURL(file));
      }

      setMessage("프로필 이미지가 저장되었습니다.");
    } catch (err) {
      setError(err.message || "프로필 이미지 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // 로그아웃은 저장된 토큰을 제거하고 로그인 화면으로 보냅니다.
    clearAccessToken();
    navigate("/login", { replace: true });
  };

  const initial = profile.name?.trim()?.[0] || profile.email?.trim()?.[0] || "H";

  return (
    <ProfilePage>
      {/* 공통 네비게이션 */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      <ProfileShell>
        <ProfileHeader>
          <h1>프로필</h1>
          <p>계정 정보와 연락처를 확인하고 수정할 수 있습니다.</p>
        </ProfileHeader>

        <ProfileCard>
          <ProfileAvatarPanel>
            <ProfileAvatar>
              {previewImage ? <img src={previewImage} alt="프로필 이미지" /> : initial.toUpperCase()}
            </ProfileAvatar>
            <ProfileImageButton
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isLoading || isSaving}
            >
              이미지 변경
            </ProfileImageButton>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </ProfileAvatarPanel>

          <ProfileForm>
            <ProfileField>
              이메일
              <ProfileInput value={profile.email} disabled />
            </ProfileField>
            <ProfileField>
              권한
              <ProfileInput value={profile.role || "-"} disabled />
            </ProfileField>
            <ProfileField>
              이름
              <ProfileInput value={profile.name || "-"} disabled />
            </ProfileField>
            <ProfileField>
              휴대폰 번호
              <ProfileInput
                type="tel"
                inputMode="numeric"
                maxLength={13}
                value={profile.phone}
                disabled
              />
            </ProfileField>

            {message ? <ProfileMessage>{message}</ProfileMessage> : null}
            {error ? <ProfileMessage $error>{error}</ProfileMessage> : null}

            <ProfileActions>
              <ProfileButton type="button" $variant="outline" onClick={handleLogout}>
                로그아웃
              </ProfileButton>
              <ProfileButton type="button" onClick={handleOpenEdit} disabled={isLoading || isSaving}>
                수정하기
              </ProfileButton>
            </ProfileActions>
          </ProfileForm>
        </ProfileCard>
      </ProfileShell>

      {isEditOpen ? (
        <ProfileDialogBackdrop role="presentation" onMouseDown={handleCloseEdit}>
          <ProfileDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-edit-title"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={handleSave}
          >
            <ProfileDialogHeader>
              <h2 id="profile-edit-title">프로필 수정</h2>
              <p>휴대폰 번호를 수정할 수 있습니다.</p>
            </ProfileDialogHeader>

            <ProfileField>
              이름
              <ProfileInput value={profile.name || "-"} disabled />
            </ProfileField>
            <ProfileField>
              휴대폰 번호
              <ProfileInput
                type="tel"
                inputMode="numeric"
                maxLength={13}
                value={editProfile.phone}
                onChange={handleEditChange("phone")}
                disabled={isSaving}
                autoFocus
              />
            </ProfileField>

            {error ? <ProfileMessage $error>{error}</ProfileMessage> : null}

            <ProfileDialogActions>
              <ProfileButton type="button" $variant="outline" onClick={handleCloseEdit} disabled={isSaving}>
                취소
              </ProfileButton>
              <ProfileButton type="submit" disabled={isSaving}>
                {isSaving ? "저장 중..." : "저장하기"}
              </ProfileButton>
            </ProfileDialogActions>
          </ProfileDialog>
        </ProfileDialogBackdrop>
      ) : null}
    </ProfilePage>
  );
}

export default Profile;
