import React from "react";

// Minimal no-op fallback for framer-motion's `motion`
// Usage: motion.div, motion.span, motion.button, etc.
const handler = {
  get(_target, tag) {
    return React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...props }, children)
    );
  },
};

export const motion = new Proxy({}, handler);

export default { motion };






































