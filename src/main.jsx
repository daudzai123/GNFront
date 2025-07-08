import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./contexts/app/app-context.jsx";
import { AuthProvider } from "./contexts/auth/auth-context.jsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { AuthTokenProvider } from "./contexts/auth/authToken-context.jsx";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <AuthTokenProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AuthTokenProvider>
  </AppProvider>
);
