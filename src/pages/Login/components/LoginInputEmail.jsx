const LoginEmailInput = ({ value, onChange, onKeyDown, disabled }) => {
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
        className="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
    </div>
  );
};

export default LoginEmailInput;