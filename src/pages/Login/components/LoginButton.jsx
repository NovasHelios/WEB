const LoginButton = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex h-14 w-full items-center justify-center gap-2 bg-[#d6a81b] text-[18px] font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "로그인 중..." : "로그인"}
    </button>
  );
};

export default LoginButton;
