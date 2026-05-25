const Box = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[448px] p-8 bg-white shadow-lg rounded-3xl min-h-[520px]">
        {children}
      </div>
    </div>
  );
};

export default Box;