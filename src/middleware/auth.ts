import { Request } from "express";

/** Optional: read Bearer token; for mock backend we accept any or none. */
export function getUserId(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

export function authMiddleware(
  req: Request,
  _res: unknown,
  next: () => void,
): void {
  const userId = getUserId(req);
  (req as Request & { userId: string | null }).userId = userId ?? null;
  next();
}
