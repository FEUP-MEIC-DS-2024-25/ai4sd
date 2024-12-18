export function getCsrfToken() {
    const cookies = document.cookie.split("; ");
    const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrftoken="));
    return csrfCookie && csrfCookie.split("=")[1];
}