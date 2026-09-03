import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, clearAccessToken, getValidAccessToken } from "@/lib/auth";
import {
  ProfileActions,
  ProfileAvatar,
  ProfileAvatarPanel,
  ProfileButton,
  ProfileCard,
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

const resolveImageUrl = (path) => {
  // 프로필 이미지가 없으면 기본 이니셜 UI를 사용합니다.
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
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
        setProfile({
          email: user.email || "",
          name: user.name || "",
          phone: user.phone || "",
          role: user.role || "",
          profileImagePath: user.profileImagePath || "",
        });
        setPreviewImage(resolveImageUrl(user.profileImagePath || ""));
      } catch (err) {
        setError(err.message || "프로필 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    // 페이지 진입 시 내 프로필 정보를 조회합니다.
    void fetchProfile();
  }, [navigate]);

  const handleChange = (field) => (event) => {
    // 수정 가능한 프로필 입력값을 변경합니다.
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    setMessage("");
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!profile.name.trim() || !profile.phone.trim()) {
      setError("이름과 휴대폰 번호를 입력해주세요.");
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
          name: profile.name.trim(),
          phone: profile.phone.trim(),
        }),
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "프로필 수정에 실패했습니다.");
      }

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

      setPreviewImage(URL.createObjectURL(file));
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

          <ProfileForm onSubmit={handleSave}>
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
              <ProfileInput value={profile.name} onChange={handleChange("name")} disabled={isLoading || isSaving} />
            </ProfileField>
            <ProfileField>
              휴대폰 번호
              <ProfileInput value={profile.phone} onChange={handleChange("phone")} disabled={isLoading || isSaving} />
            </ProfileField>

            {message ? <ProfileMessage>{message}</ProfileMessage> : null}
            {error ? <ProfileMessage $error>{error}</ProfileMessage> : null}

            <ProfileActions>
              <ProfileButton type="button" $variant="outline" onClick={handleLogout}>
                로그아웃
              </ProfileButton>
              <ProfileButton type="submit" disabled={isLoading || isSaving}>
                {isSaving ? "저장 중..." : "저장하기"}
              </ProfileButton>
            </ProfileActions>
          </ProfileForm>
        </ProfileCard>
      </ProfileShell>
    </ProfilePage>
  );
}

export default Profile;
