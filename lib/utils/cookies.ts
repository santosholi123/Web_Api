/**
 * Cookie utilities for client-side cookie management
 */

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

export function setCookie(
  name: string,
  value: string,
  days: number = 7
): void {
  if (typeof document === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();

  document.cookie =
    name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

export function deleteCookie(name: string): void {
  setCookie(name, "", -1);
}
