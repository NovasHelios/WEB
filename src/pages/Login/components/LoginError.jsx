const LoginError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="px-4 py-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-2xl">
      {message}
    </div>
  );
};

export default LoginError;