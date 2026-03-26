"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      duration={5000}
      toastOptions={{
        style: { background: "transparent", border: "none", padding: 0, boxShadow: "none" },
      }}
      {...props}
    />
  );
};

export { Toaster };