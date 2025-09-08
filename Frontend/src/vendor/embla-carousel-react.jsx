import React, { useRef, useMemo } from "react";

export default function useEmblaCarousel() {
  const viewportRef = useRef(null);
  const api = useMemo(() => {
    const listeners = {};
    return {
      scrollPrev: () => {},
      scrollNext: () => {},
      canScrollPrev: () => false,
      canScrollNext: () => false,
      on: (event, cb) => {
        listeners[event] = cb;
      },
      off: (event) => {
        delete listeners[event];
      },
    };
  }, []);
  return [viewportRef, api];
}


