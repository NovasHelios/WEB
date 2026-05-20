const LoginEmailInput = ({ value, onChange, onKeyDown, disabled, error }) => {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        placeholder="Enter Your Email"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 disabled:opacity-50 no-underline ${error ? "ring-2 ring-red-400 text-red-500 focus:ring-red-400" : "focus:ring-blue-500"}`}
      />
      {error ? (
        <p className="mt-1 text-sm font-semibold text-right text-red-500">{error}</p>
      ) : (
        <p className="mt-1 text-sm invisible">placeholder</p>
      )}
    </div>
  );
};

export default LoginEmailInput;