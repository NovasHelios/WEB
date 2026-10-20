// 로컬 개발에서는 Vite 프록시를 사용해 브라우저 CORS를 피합니다.
const BASE = import.meta.env.DEV ? "" : "https://api.helioss.site";
const SOCKET_BASE = import.meta.env.DEV
  ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`
  : BASE.replace(/^http/, "ws");
// Google 로그인은 로컬에서도 프록시 대신 백엔드 인증 서버에서 시작합니다.
const OAUTH_BASE = "https://api.helioss.site";

export const Api = {
  // Auth
  SignUp: `${BASE}/api/auth/signup`,
  Login: `${BASE}/api/auth/login`,
  EmailVarify: `${BASE}/api/auth/email/verify`,
  EmailSend: `${BASE}/api/auth/email/send`,
  EmailResend: `${BASE}/api/auth/email/resend`,

  // Land
    VworldLand: `${BASE}/api/vworld/land`, // GET 주소 기반 토지 자동 조회
    LandDevelopmentAnalysis: (landId) =>
      `${BASE}/api/lands/${encodeURIComponent(landId)}/analysis/development`, // GET 토지 개발 적합도 분석
    SolarSummary: `${BASE}/api/ai/solar/summary`, // GET 토지 AI 종합 보고서
  Lands: `${BASE}/api/lands`,                                                        // GET 전체조회 / POST 등록 (multipart)
  MyLands: `${BASE}/api/lands/me`,                                                    // GET 내가 등록한 토지 목록
  Land: (landId) => `${BASE}/api/lands/${landId}`,                                   // GET 상세 / PATCH 수정 / DELETE 삭제
  LandImage: (landId) => `${BASE}/api/lands/${landId}/image`,                        // PATCH 이미지 추가·교체
  LandApprove: (landId) => `${BASE}/api/lands/${landId}/approve`,                    // PATCH 소유자 승인
  LandReject: (landId) => `${BASE}/api/lands/${landId}/reject`,                      // PATCH 소유자 거절
  LandFilter: `${BASE}/api/lands/filter`,                                             // POST 필터 조회

  // User
  MyProfile: `${BASE}/api/users/me`, // GET 내 정보 / PATCH 수정
  MyPlan: `${BASE}/api/users/me/plan`, // GET/PATCH 내 플랜
  MyProfileImage: `${BASE}/api/users/me/image`, // PATCH 프로필 이미지
  BusinessProfile: `${BASE}/api/business/profile`, // GET/PUT 내 사업자 프로필
  BusinessProfileLicense: `${BASE}/api/business/profile/license`, // PATCH 사업자등록증 업로드
  BusinessProfiles: `${BASE}/api/business/profiles`, // GET 사업자 목록
  BusinessProfileDetail: (id) => `${BASE}/api/business/profiles/${encodeURIComponent(id)}`, // GET 사업자 상세

  // Apply
  Applies: (landId) => `${BASE}/api/applies/${landId}`, // GET 토지별 신청 목록 / POST 신청
  MyApplies: `${BASE}/api/applies/me`, // GET 내 신청 내역
  ApplyApprove: (applyId) => `${BASE}/api/applies/${applyId}/approve`, // PATCH 신청 승인
  ApplyReject: (applyId) => `${BASE}/api/applies/${applyId}/reject`, // PATCH 신청 거절

  // Wish
  Wishes: `${BASE}/api/wishes`, // GET 내 찜 목록
  Wish: (landId) => `${BASE}/api/wishes/${landId}`, // POST 찜 등록 / DELETE 찜 취소

  // Chat
  ChatDelete: (roomId) => `${BASE}/api/chat/rooms/${encodeURIComponent(roomId)}`, // DELETE 채팅방 삭제
  ChatRooms: `${BASE}/api/chat/rooms`,                                               // GET 목록 / POST 생성
  ChatRoomOwner: (landId, businessUserId, initialMessage = "") => {
    const query = new URLSearchParams({ landId: String(landId), businessUserId: String(businessUserId) });
    if (initialMessage) query.set("initialMessage", initialMessage);
    return `${BASE}/api/chat/rooms/owner?${query.toString()}`;
  }, // POST 토지 소유자가 사업자에게 채팅 시작
  ChatMessages: (roomId) => `${BASE}/api/chat/rooms/${roomId}/messages`,             // GET 메시지 목록
  ChatAttachment: (roomId) => `${BASE}/api/chat/rooms/${roomId}/attachments`,        // POST 파일 첨부
  ChatAccept: (roomId) => `${BASE}/api/chat/rooms/${roomId}/accept`,                 // PATCH 수락
  ChatReject: (roomId) => `${BASE}/api/chat/rooms/${roomId}/reject`,                 // PATCH 거절
  ChatClose: (roomId) => `${BASE}/api/chat/rooms/${roomId}/close`,                   // PATCH 종료
  ChatSocket: `${SOCKET_BASE}/ws/chat`,                                               // WebSocket STOMP 기본 연결
  ChatSocketCandidates: () => {                                                     // 서버는 STOMP CONNECT 헤더 인증만 사용합니다.
    const socketBase = SOCKET_BASE;
    return [`${socketBase}/ws/chat`];
  },
  ChatSendMessage: (roomId) => `/app/chat/rooms/${roomId}/messages`, // STOMP 텍스트 메시지 전송
  ChatSubscribeRoom: (roomId) => `/topic/chat/rooms/${roomId}`, // STOMP 채팅방 수신
  ChatSubscribeMessages: (roomId) => `/topic/chat/rooms/${roomId}/messages`, // STOMP 메시지 수신

  // OAuth
  // Google OAuth는 백엔드 인증 서버에서 시작합니다.
  googleLogin: `${OAUTH_BASE}/oauth2/authorization/google`,
};
