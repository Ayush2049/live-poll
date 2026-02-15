import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Import CSS files in proper order
import "./styles/design/theme.css";
import "./styles/design/animations.css";
import "./styles/layout/container.css";
import "./styles/layout/grid.css";
import "./styles/layout/formLayout.css";
import "./styles/layout/pollLayout.css";
import "./styles/design/components.css";
import "./styles/design/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
