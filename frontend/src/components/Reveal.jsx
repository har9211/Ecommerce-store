import { useScrollReveal } from "../hooks/useScrollReveal";

// Wraps any section - fades/slides it in the first time it scrolls into view.
export default function Reveal({ children, className = "" }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`${className} reveal ${visible ? "reveal-visible" : ""}`}>
      {children}
    </div>
  );
}
