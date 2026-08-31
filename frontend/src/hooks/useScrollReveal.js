import { useEffect, useRef, useState } from "react";

// Returns a ref to attach to any element, plus whether it has scrolled
// into view yet. Used to trigger a fade/slide-in animation the first
// time a section becomes visible, instead of everything animating at
// once on page load.
export function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // only need to animate in once
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}
