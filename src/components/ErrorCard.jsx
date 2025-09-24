
const ErrorCard = ({ title, message }) => {
  return (
    <div className="p-10 bg-amber-200 border-2 border-yellow-300 rounded-sm w-1/2 flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>

        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorCard;