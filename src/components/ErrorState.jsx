function ErrorState({ message, actionLabel, onAction, fullScreen = false }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-50 p-10 text-center ${fullScreen ? 'min-h-screen' : ''}`}>
      <h2 className="text-xl font-bold text-red-500 sm:text-2xl">{message}</h2>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-gray-900"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorState;
