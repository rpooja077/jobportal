import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      expand
      richColors
      duration={3000}
      {...props}
    />
  );
}

export { Toaster }
