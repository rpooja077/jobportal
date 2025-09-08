import * as React from "react";

const variantToClasses = {
  default: "badge bg-primary",
  secondary: "badge bg-secondary",
  destructive: "badge bg-danger",
  outline: "badge bg-light text-dark border border-secondary",
};

function Badge({ className = "", variant = "default", ...props }) {
  const classes = [variantToClasses[variant] || variantToClasses.default, className]
    .filter(Boolean)
    .join(" ");
  return (<span className={classes} {...props} />);
}

export { Badge };
