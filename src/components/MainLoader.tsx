const MainLoader = () => {
  return (
    <div className="w-full min-h-screen absolute top-0 left-0 bg-white flex flex-col gap-2 items-center justify-center z-50">
      <div className="w-64 sm:w-80 md:w-96 lg:w-[32rem] xl:w-[40rem] p-4 rounded-lg bg-amazonBlue flex items-center justify-center relative">
        <img
          src={"/getkkul-logo-Up-down.png"}
          alt="Logo"
          className="w-60 sm:w-76 md:w-92 lg:w-[30rem] xl:w-[38rem] h-auto object-contain"
        />
      </div>

      <span className="w-14 h-14 inline-flex border-8 border-border-color rounded-full relative">
        <span className="w-14 h-14 border-8 border-r-sky-color border-b-border-color border-t-border-color border-l-border-color rounded-full absolute -top-2 -left-2 animate-spin" />
      </span>
      <p className="text-lg text-center font-semibold text-theme-color tracking-wide">
        Loading...
      </p>
    </div>
  );
};

export default MainLoader;
