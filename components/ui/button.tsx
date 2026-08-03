import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "light" | "ghost";
  size?: "default" | "small";
};

export function Button({ asChild, className = "", variant = "primary", size = "default", ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const classes = ["button", `button--${variant}`, size === "small" ? "button--small" : "", className]
    .filter(Boolean)
    .join(" ");
  return <Component className={classes} {...props} />;
}
