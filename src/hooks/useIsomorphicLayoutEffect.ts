import { useEffect, useLayoutEffect } from "react";

// Avoids the "useLayoutEffect does nothing on the server" warning
// when this component is ever rendered outside the browser.
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
