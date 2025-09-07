import { useEffect } from "react";
import "./TopBar.css";

export default function TopBar({ currentMode, setCurrentMode }) {
  // Handle mode change
  const changeType = (type) => {
    setCurrentMode((prev) => ({ ...prev, type }));
  };

  const WordSelection = () => (
    <>
      <button className="button">
        <span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.28 12.11C3.71 7.22 8.02 3.25 12.85 3.25c2.81 0 4.85.92 6.13 2.32 1.28 1.39 1.94 3.4 1.73 5.82-.45 3.48-1.85 4.43-2.52 4.58-.36.08-.62-.01-.76-.14-.13-.11-.24-.3-.19-.65l1.04-7.76c.07-.55-.32-1.05-.87-1.12l-.5-.07c-.55-.07-1.05.32-1.12.87l-.02.1a4.21 4.21 0 0 0-1.86-1.15c-3.08-1.1-6.34.82-7.49 3.94-1.15 3.12.03 6.76 3.12 7.87 1.96.7 3.99.14 5.5-1.18.18.35.44.66.76.94.79.68 1.86.93 2.92.7 2.18-.47 3.97-2.75 4.47-6.72.26-3.02-.54-5.77-2.39-7.8C18.98 1.87 16.22.75 12.85.75 6.71.75 1.33 5.73.79 11.89c-.54 6.24 4.07 11.36 10.31 11.36 1.92 0 3.16-.16 5-1.03.51-.22.74-.83.52-1.34l-.2-.46a1 1 0 0 0-1.34-.52c-1.45.63-2.34.76-4.02.76-4.74 0-8.24-3.84-7.84-8.52zm5.5-1.16c.8-2.16 2.83-3.08 4.31-2.55 1.48.52 2.43 2.47 1.63 4.63-.8 2.15-2.83 3.07-4.31 2.54-1.48-.53-2.43-2.47-1.63-4.62z"
              fill="currentColor"
            />
          </svg>
          punctuation
        </span>
      </button>

      <button className="button">
        <span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.39 1.79c.55.06.95.55.89 1.1l-.54 4.86h3.48l.57-5.14c.06-.55.55-.95 1.1-.89l.5.05c.55.06.95.55.89 1.1l-.54 4.88H20.2c.55 0 1 .45 1 1v.5c0 .55-.45 1-1 1h-3.8l-.39 3.5h4.19c.55 0 1 .45 1 1v.5c0 .55-.45 1-1 1h-4.46l-.57 5.14c-.06.55-.55.95-1.1.89l-.5-.06a1 1 0 0 1-.89-1.1l.54-4.87H9.79l-.57 5.14c-.06.55-.55.95-1.1.89l-.5-.06a1 1 0 0 1-.89-1.1l.54-4.87H3.75c-.55 0-1-.45-1-1v-.5c0-.55.45-1 1-1h3.8l.39-3.5H3.75c-.55 0-1-.45-1-1v-.5c0-.55.45-1 1-1h4.46l.57-5.14c.06-.55.55-.95 1.1-.89l.5.05zm3.16 11.97l.39-3.5h-3.49l-.39 3.5h3.49z"
              fill="currentColor"
            />
          </svg>
          numbers
        </span>
      </button>

      <span>|</span>
    </>
  );

  const renderSubGroup = () => {
    if (currentMode.type === "words" || currentMode.type === "time") return <WordSelection />;
    return null;
  };

  // For debugging
  useEffect(() => {
    console.log(currentMode);
  }, [currentMode]);

  return (
    <div id="topbar">
      <div className="group">
        {currentMode.subgroup && (
          <div id="topbar-sub-group">{renderSubGroup()}</div>
        )}

        <div id="topbar-main-group">
          {["time", "words", "quote", "custom"].map((type) => (
            <button
              key={type}
              className={`button ${
                currentMode.type === type ? "selected" : ""
              }`}
              onClick={() => changeType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
