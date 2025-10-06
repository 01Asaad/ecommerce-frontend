import { useTheme } from "../context/ThemeProvider"

export default function DarkThemeManage() {
  const { currentThemeChoice, setTheme } = useTheme()
  const currentTheme = currentThemeChoice
  
  const systemDefaultHandle = () => {
    setTheme('system');
  };
  const lightThemeHandle = () => {
    setTheme('light');
  };
  const darkThemeHandle = () => {
    setTheme('dark');
  };

  return (
    <div className="flex justify-start items-center gap-x-1 border-1 border-white rounded-full p-1 relative">
      <div
        className={`absolute bg-white rounded-full transition-all duration-300 ease-in-out w-5 h-5 lg:w-8 lg:h-8 opacity-20 ${
          currentTheme === 'system' ? 'left-1' : 
          currentTheme === 'light' ? 'left-7 lg:left-10' : 
          'left-13 lg:left-19'
        }`}
      />
      <button
        onClick={systemDefaultHandle}
        className={`relative cursor-pointer z-2 p-1 hover:text-gray-400 rounded-full ${currentTheme === 'system' ? 'text-black' : 'text-white'}`}
        aria-label="Use system theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3 lg:size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>
      </button>
      <button
        onClick={lightThemeHandle}
        className={`relative cursor-pointer z-2 p-1 hover:text-gray-400 rounded-full ${currentTheme === 'light' ? 'text-black' : 'text-white'}`}
        aria-label="Use light theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3 lg:size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      </button>
      <button
        onClick={darkThemeHandle}
        className={`relative cursor-pointer hover:text-gray-400 z-2 p-1 rounded-full ${currentTheme === 'dark' ? 'text-black' : 'text-white'}`}
        aria-label="Use dark theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3 lg:size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      </button>
    </div>
  );
}