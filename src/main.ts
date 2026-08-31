import App from "./App.svelte";
import { initializeAuth } from "./stores/auth";

// Initialize auth from localStorage before rendering
initializeAuth();

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
