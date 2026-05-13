const Box = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-3xl">
        {children}
      </div>
    </div>
  );
};

export default Box;