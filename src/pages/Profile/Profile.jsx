import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Mail, Phone, Trash2, UserRound } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import SideBar from "@/components/layout/box/SideBar";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import useSidebarOpen from "@/hooks/useSidebarOpen";

const normalizeBaseUrl = (value) => {
  const rawValue = value || "https://www.helioss.site";
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }

  return `https://${rawValue.replace(/\/$/, "")}`;
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const resolveProfileImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  if (path.startsWith("uploads/")) return `${API_BASE_URL}/${path}`;
  return `${API_BASE_URL}/uploads/profiles/${path}`;
};

const getProfileRows = (profile) => [
  {
    icon: UserRound,
    value: profile?.name || "-",
    action: "이름 변경",
  },
  {
    icon: Mail,
    value: profile?.email || "-",
    action: "이메일 변경",
  },
  {
    icon: Phone,
    value: profile?.phone || "-",
    action: "전화번호 변경",
  },
  {
    icon: KeyRound,
    value: "비밀번호",
    action: "비밀번호 변경",
  },
  {
    icon: Trash2,
    value: "계정 삭제",
    action: "계정 삭제",
    danger: true,
  },
];

function Profile() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useSidebarOpen();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const sidebarWidth = sidebarOpen ? "180px" : "72px";
  const profileImageUrl = resolveProfileImageUrl(profile?.profileImagePath);

  useEffect(() => {
    const token = getValidAccessToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await authFetch(Api.MyProfile, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await response.json() : null;

        if (response.status === 401 || response.status === 403) {
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(data?.message || data?.data?.message || "프로필을 불러오지 못했습니다.");
        }

        setProfile(data?.data ?? data);
      } catch (err) {
        setError(err.message || "프로필을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [navigate]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-white">
      <div className="relative z-30">
        <NavBar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSearch={() => {}}
          isSuggestionOpen={false}
          regionSuggestions={[]}
        />
      </div>

      <div
        className="fixed left-0 bottom-0 z-20"
        style={{
          top: "56px",
          width: sidebarWidth,
          transition: "width 0.3s",
        }}
      >
        <SideBar expanded={sidebarOpen} />
      </div>

      <main
        className="h-[calc(100vh-56px)] overflow-auto bg-white"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s",
        }}
      >
        <section className="flex gap-10 px-12 py-8 max-[900px]:flex-col max-[900px]:px-6">
          <div className="flex w-56 shrink-0 flex-col items-center gap-4">
            <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-white">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={profile?.name || "profile"}
                  className="h-full w-full object-cover grayscale"
                />
              ) : (
                <UserRound size={96} strokeWidth={1.8} className="text-[#f2a532]" />
              )}
            </div>
            <button
              type="button"
              className="h-8 w-32 rounded-md bg-[#f2a532] text-sm font-bold text-white"
            >
              Change
            </button>
          </div>

          <div className="w-full max-w-3xl rounded-lg border-2 border-black bg-[#d9d9d9] px-3 py-3">
            {isLoading ? (
              <div className="py-12 text-center text-base font-bold text-black">불러오는 중...</div>
            ) : error ? (
              <div className="py-12 text-center text-base font-bold text-red-500">{error}</div>
            ) : (
              <div className="flex flex-col gap-3">
                {getProfileRows(profile).map(({ icon: Icon, value, action, danger }) => (
                  <div
                    key={action}
                    className="grid grid-cols-[40px_1fr_160px] items-center gap-2 max-[640px]:grid-cols-[36px_1fr] max-[640px]:gap-y-2"
                  >
                    <Icon size={30} strokeWidth={2.6} className="text-[#f2a532]" />
                    <span className="min-w-0 truncate text-base text-black">{value}</span>
                    <button
                      type="button"
                      className={`h-7 rounded-md bg-white px-3 text-sm max-[640px]:col-span-2 max-[640px]:ml-10 ${
                        danger ? "text-red-500" : "text-black"
                      }`}
                    >
                      {action}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
