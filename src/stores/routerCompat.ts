import { navigate } from "svelte-routing";
import { writable } from "svelte/store";

export function push(path: string) {
  navigate(path);
  location.set(path);
}

export function replace(path: string) {
  navigate(path, { replace: true });
  location.set(path);
}

// Dummy action since we handle links globally in App.svelte
export function link(node: HTMLElement) {
  return {
    destroy() {},
  };
}

export const location = writable(window.location.pathname);

// Listen to popstate to update location store
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    location.set(window.location.pathname);
  });

  // monkey patch history to catch manual navigations
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    location.set(window.location.pathname);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    location.set(window.location.pathname);
  };
}
