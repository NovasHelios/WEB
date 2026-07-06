export const Api = {
  SignUp: "https://www.helioss.site/api/auth/signup",
  Login: "https://www.helioss.site/api/auth/login",
  EmailVarify: "https://www.helioss.site/api/auth/email/verify",
  EmailSend: "https://www.helioss.site/api/auth/email/send",
  EmailResend: "https://www.helioss.site/api/auth/email/resend",
  Lands: "/api/lands",
  LandImage: (landId) => `/api/lands/${landId}/image`,
  MyProfile: "/api/users/me",
  MyProfileImage: "/api/users/me/image",
};
