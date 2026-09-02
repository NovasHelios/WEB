const LoginEmailInput = ({ value, onChange, onKeyDown, disabled, error }) => {
  return (
    <div>
      <label className="mb-3 block text-[14px] font-medium text-[#6a5c4a]">
        이메일 / 아이디
      </label>
      <input
        type="email"
        placeholder="이메일을 입력해 주세요"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`w-full border-0 border-b-2 bg-transparent px-0 pb-3 text-[17px] text-[#2b2b2b] outline-none placeholder:text-[#beb7ae] disabled:opacity-50 ${
          error ? "border-b-red-400 text-red-600 placeholder:text-red-300" : "border-b-[#262626] focus:border-b-[#d6a81b]"
        }`}
      />
      {error ? (
        <p className="mt-2 text-right text-sm font-medium text-red-500">{error}</p>
      ) : (
        <p className="mt-2 text-sm invisible">placeholder</p>
      )}
    </div>
  );
};

export default LoginEmailInput;
