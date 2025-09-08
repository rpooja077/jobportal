import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

const Label = React.forwardRef(({ className = "", ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={["form-label", className].filter(Boolean).join(" ")} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
