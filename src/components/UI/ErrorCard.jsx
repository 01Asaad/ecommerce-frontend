
const ErrorCard = ({ message }) => {
  return (
    <div className="p-10 bg-gray-900 border-0 border-yellow-300 rounded-sm w-full h-[40vh] flex flex-col justify-evenly items-center">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>

        <h3>Error</h3>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default ErrorCard;