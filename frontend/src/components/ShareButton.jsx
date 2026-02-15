import { useState } from "react";

const ShareButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#22d3ee",
        fontSize: "14px",
      }}
    >
      {copied ? "✓ Copied!" : "🔗 Share"}
    </button>
  );
};

export default ShareButton;
