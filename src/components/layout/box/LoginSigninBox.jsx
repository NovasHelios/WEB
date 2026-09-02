const Box = ({ children }) => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[700px] items-start justify-center">
      <div className="mt-8 w-full rounded-[18px] border border-[#f0dfb2] bg-white px-8 py-9 shadow-[0_30px_70px_rgba(214,168,27,0.16)] max-[640px]:px-5 max-[640px]:py-8">
        {children}
      </div>
    </div>
  );
};

export default Box;
