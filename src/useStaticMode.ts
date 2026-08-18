import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useStaticMode() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isStatic = searchParams.get("static") === "1";

  const go = useCallback(
    (path: string) => {
      navigate(isStatic ? `${path}?static=1` : path);
    },
    [isStatic, navigate],
  );

  return { isStatic, go };
}
