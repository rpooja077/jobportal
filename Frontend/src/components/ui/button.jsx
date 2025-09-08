import * as React from "react";

const variantToClasses = {
  default: "btn btn-primary",
  outline: "btn btn-outline-secondary",
  secondary: "btn btn-secondary",
  destructive: "btn btn-danger",
  ghost: "btn btn-light",
  link: "btn btn-link",
};

const sizeToClasses = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-sm p-2 d-inline-flex align-items-center justify-content-center",
};

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? "span" : "button";
  const classes = [variantToClasses[variant] || variantToClasses.default, sizeToClasses[size] || "", className]
    .filter(Boolean)
    .join(" ");
  return <Comp className={classes} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button };
