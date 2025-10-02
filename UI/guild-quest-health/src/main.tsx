import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/ar-viewer.css";
import "@google/model-viewer";

createRoot(document.getElementById("root")!).render(<App />);
