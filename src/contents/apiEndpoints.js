export const Api = {
  SignUp: "https://www.helioss.site/api/auth/signup",
  Login: "https://www.helioss.site/api/auth/login",
  EmailVarify: "https://www.helioss.site/api/auth/email/verify",
  EmailSend: "https://www.helioss.site/api/auth/email/send",
  EmailResend: "https://www.helioss.site/api/auth/email/resend",
  Lands: "https://www.helioss.site/api/lands",
  LandImage: (landId) => `https://www.helioss.site/api/lands/${landId}/image`,
  MyProfile: "https://www.helioss.site/api/users/me",
  MyProfileImage: "https://www.helioss.site/api/users/me/image",
};
