import { verifyToken } from "./jwt";

export function getUserFromRequest(request) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return { error: "Unauthorized: No cookie", status: 401 };
  }

  const match = cookieHeader.match(/Authorization=Bearer\s([^;]+)/);
  const token = match?.[1];

  if (!token) {
    return { error: "Unauthorized: No token found in cookie", status: 401 };
  }

  try {
    const decoded = verifyToken(token);
    return { user: decoded };
  } catch (err) {
    return { error: "Unauthorized: Invalid token", status: 403 };
  }
}
