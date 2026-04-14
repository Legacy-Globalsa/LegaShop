import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./use-auth";

/**
 * Returns a guard function that redirects to login if not authenticated.
 * Pass `returnTo` to override the default (current path).
 * The guard returns `true` if authenticated, `false` if redirecting.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (returnTo?: string) => {
      if (isAuthenticated) return true;
      const from = returnTo ?? location.pathname + location.search;
      navigate("/login", { state: { from }, replace: true });
      return false;
    },
    [isAuthenticated, navigate, location],
  );

  return { isAuthenticated, requireAuth };
}
