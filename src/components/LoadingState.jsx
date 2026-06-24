function LoadingState({ fullScreen = false, label = 'Loading' }) {
  return (
    <div
      className={`flex items-center justify-center bg-gray-50 ${fullScreen ? 'min-h-screen' : 'h-64'}`}
      role="status"
      aria-label={label}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-yellow-500" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LoadingState;
