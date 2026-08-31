export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

export function getCurrentUser(): any {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: any): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem("user");
}
