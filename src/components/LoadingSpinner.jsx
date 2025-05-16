export default function LoadingSpinner({ size = "md", message = "Lade Daten..." }) {
    const sizeClass = {
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
      xl: "loading-lg w-16 h-16"
    }[size] || "loading-md";
  
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 py-6">
        <span className={`loading loading-spinner ${sizeClass}`}></span>
        {message && <p className="text-sm">{message}</p>}
      </div>
    );
  }

//   {loading && <LoadingSpinner size="lg" message="Artikel werden geladen..." />}
