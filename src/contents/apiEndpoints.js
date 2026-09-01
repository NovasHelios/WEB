const BASE = "https://www.helioss.site";

export const Api = {
  // Auth
  SignUp: `${BASE}/api/auth/signup`,
  Login: `${BASE}/api/auth/login`,
  EmailVarify: `${BASE}/api/auth/email/verify`,
  EmailSend: `${BASE}/api/auth/email/send`,
  EmailResend: `${BASE}/api/auth/email/resend`,

  // Land
  Lands: `${BASE}/api/lands`,                                                        // GET 전체조회 / POST 등록 (multipart)
  Land: (landId) => `${BASE}/api/lands/${landId}`,                                   // GET 상세 / PATCH 수정 / DELETE 삭제
  LandImage: (landId) => `${BASE}/api/lands/${landId}/image`,                        // PATCH 이미지 추가·교체
  LandApprove: (landId) => `${BASE}/api/lands/${landId}/approve`,                    // PATCH 소유자 승인
  LandReject: (landId) => `${BASE}/api/lands/${landId}/reject`,                      // PATCH 소유자 거절
  LandFilter: `${BASE}/api/lands/filter`,                                             // POST 필터 조회

  // User
  MyProfile: `${BASE}/api/users/me`,                                                 // GET 내 정보 / PATCH 수정
  MyProfileImage: `${BASE}/api/users/me/image`,                                      // PATCH 프로필 이미지

  // Apply
  Applies: (landId) => `${BASE}/api/applies/${landId}`,                              // GET 토지별 신청 목록 / POST 신청
  MyApplies: `${BASE}/api/applies/me`,                                               // GET 내 신청 내역
  ApplyApprove: (applyId) => `${BASE}/api/applies/${applyId}/approve`,               // PATCH 신청 승인
  ApplyReject: (applyId) => `${BASE}/api/applies/${applyId}/reject`,                 // PATCH 신청 거절

  // Wish
  Wishes: `${BASE}/api/wishes`,                                                       // GET 내 찜 목록
  Wish: (landId) => `${BASE}/api/wishes/${landId}`,                                  // POST 찜 등록 / DELETE 찜 취소

  // Chat
  ChatRooms: `${BASE}/api/chat/rooms`,                                               // GET 목록 / POST 생성
  ChatMessages: (roomId) => `${BASE}/api/chat/rooms/${roomId}/messages`,             // GET 메시지 목록
  ChatAttachment: (roomId) => `${BASE}/api/chat/rooms/${roomId}/attachments`,        // POST 파일 첨부
  ChatAccept: (roomId) => `${BASE}/api/chat/rooms/${roomId}/accept`,                 // PATCH 수락
  ChatReject: (roomId) => `${BASE}/api/chat/rooms/${roomId}/reject`,                 // PATCH 거절
  ChatClose: (roomId) => `${BASE}/api/chat/rooms/${roomId}/close`,                   // PATCH 종료

  // OAuth
  googleLogin: `${BASE}/oauth2/callback`,
};
