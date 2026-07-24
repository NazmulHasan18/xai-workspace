"use client";

import { useEffect, useRef, useState } from "react";
import { ClusterEngine, type ClusterEngineOptions } from "./cluster-engine";

interface CursorState {
  x: number;
  y: number;
  active: boolean;
}

export function useNodeCluster(options?: ClusterEngineOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<ClusterEngine | null>(null);
  const [cursor, setCursor] = useState<CursorState>({ x: 0, y: 0, active: false });
  const cursorTargetRef = useRef<CursorState>({ x: 0, y: 0, active: false });
  const cursorRafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = new ClusterEngine(container, options);
    engineRef.current = engine;

    const toLocal = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      return {
        ndcX: ((clientX - rect.left) / rect.width) * 2 - 1,
        ndcY: -((clientY - rect.top) / rect.height) * 2 + 1,
        px: clientX - rect.left,
        py: clientY - rect.top,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const { ndcX, ndcY, px, py } = toLocal(event.clientX, event.clientY);
      engine.setPointer(ndcX, ndcY);
      engine.setActive(true);
      cursorTargetRef.current = { x: px, y: py, active: true };
      if (cursorRafRef.current === null) {
        cursorRafRef.current = window.requestAnimationFrame(() => {
          cursorRafRef.current = null;
          setCursor(cursorTargetRef.current);
        });
      }
    };

    const handlePointerLeave = () => {
      engine.setActive(false);
      cursorTargetRef.current = { ...cursorTargetRef.current, active: false };
      if (cursorRafRef.current === null) {
        cursorRafRef.current = window.requestAnimationFrame(() => {
          cursorRafRef.current = null;
          setCursor(cursorTargetRef.current);
        });
      }
    };

    const handleResize = () => {
      engine.resize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      if (cursorRafRef.current !== null) {
        window.cancelAnimationFrame(cursorRafRef.current);
      }
      engine.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, cursor };
}
