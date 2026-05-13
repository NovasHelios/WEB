const LoginButton = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center justify-center w-full gap-2 py-4 mb-6 text-lg font-semibold text-white transition-colors bg-orange-500 hover:bg-orange-600 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading ? "로그인 중..." : "Log In"}
    </button>
  );
};

export default LoginButton;