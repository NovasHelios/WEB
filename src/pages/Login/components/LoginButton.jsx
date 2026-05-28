const LoginButton = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center justify-center w-full gap-2 py-4 mb-6 text-lg font-semibold text-white transition-colors rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: "#FFAB03" }}
    >
      {isLoading ? "로그인 중..." : "Log In"}
    </button>
  );
};

export default LoginButton;