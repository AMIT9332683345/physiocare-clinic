/**
 * Cookie and header names shared by the edge proxy and the server-side
 * session code. Kept free of Node imports so middleware can read it.
 */
export const SESSION_COOKIE = "pc_admin";
export const CSRF_COOKIE = "pc_csrf";
export const CSRF_HEADER = "x-csrf-token";
