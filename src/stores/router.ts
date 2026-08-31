import { writable } from "svelte/store";

export function pathToPage(path: string): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  if (clean === "") return "home";
  return clean;
}

export function pageToPath(page: string): string {
  if (page === "home") return "/";
  return `/${page}`;
}

export function getCurrentRoute(): string {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    return pathToPage(path);
  }
  return "home";
}

export const currentPage = writable(getCurrentRoute());

export function navigate(target: string) {
  let page = target;
  if (target.startsWith("/")) {
    page = pathToPage(target);
  }
  currentPage.set(page);
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", pageToPath(page));
  }
}
