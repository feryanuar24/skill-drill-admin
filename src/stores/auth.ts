import { writable } from "svelte/store";

export const isLoggedIn = writable<boolean>(false);
export const currentUser = writable<any | null>(null);
export const token = writable<string | null>(null);

export function initializeAuth() {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken) {
    token.set(storedToken);
    isLoggedIn.set(true);
  }

  if (storedUser) {
    currentUser.set(JSON.parse(storedUser));
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  token.set(null);
  currentUser.set(null);
  isLoggedIn.set(false);
}

export function login(authToken: string, user: any) {
  localStorage.setItem("token", authToken);
  localStorage.setItem("user", JSON.stringify(user));
  token.set(authToken);
  currentUser.set(user);
  isLoggedIn.set(true);
}
