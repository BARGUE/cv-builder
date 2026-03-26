import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

function isValueFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

export function useFieldValidAtPath(path: string): { error?: string; isValid: boolean } {
  const { getFieldState, formState, watch } = useFormContext();
  const value = watch(path);
  const state = getFieldState(path, formState);
  const error = state?.error?.message as string | undefined;
  const valueFilled = isValueFilled(value);
  const isValid = !error && valueFilled;
  return { error, isValid: Boolean(isValid) };
}

interface ValidatedFieldProps {
  isValid: boolean;
  error?: string;
  children: React.ReactElement;
  inputClassNameWhenValid?: string;
  className?: string;
  variant?: "input" | "textarea";
  /** Met le halo (ring) sur l’enfant cloné plutôt que sur le wrapper — utile pour les pickers (Popover) où le ring du parent ne suit pas le bouton. */
  ringOnChild?: boolean;
}

export function ValidatedField({
  isValid,
  error,
  children,
  inputClassNameWhenValid = "pr-10",
  className,
  variant = "input",
  ringOnChild = false,
}: ValidatedFieldProps) {
  const child = React.Children.only(children) as React.ReactElement<{ className?: string }>;
  const hasError = Boolean(error);

  const ringClasses =
    hasError
      ? "ring-2 ring-destructive ring-offset-0 rounded-xl"
      : isValid
        ? "ring-2 ring-green-500 ring-offset-0 rounded-xl"
        : "";

  const wrappedChild = React.cloneElement(child, {
    className: cn(
      child.props.className,
      ringOnChild && ringClasses,
      isValid && inputClassNameWhenValid
    ),
  });

  return (
    <div
      className={cn(
        "relative transition-[box-shadow,border-color]",
        !ringOnChild && "rounded-xl",
        !ringOnChild && ringClasses,
        className
      )}
    >
      {wrappedChild}
      {isValid && (
        <span
          className={cn(
            "absolute pointer-events-none text-green-500 flex items-center justify-center",
            variant === "textarea"
              ? "top-3 right-3"
              : "top-1/2 right-3 -translate-y-1/2"
          )}
          aria-hidden
        >
          <Check className="h-5 w-5" strokeWidth={2.5} />
        </span>
      )}
    </div>
  );
}
