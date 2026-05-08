import * as React from "react";
import { cn } from "./utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  size?: "sm" | "default";
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = "default", onValueChange, onChange, ...props }, ref) => {
    const sizes = {
      default: "h-9 px-3 py-2",
      sm: "h-8 px-2 py-1 text-sm",
    };

    return (
      <select
        ref={ref}
        title={props.title ?? "Select option"}
        aria-label={props["aria-label"] ?? "Select option"}
        className={cn(
          "w-full border rounded-md text-sm transition-colors appearance-none bg-no-repeat pr-8",
          "bg-background text-foreground border-input",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==")] bg-[length:1.5rem_1.5rem] bg-[position:right_0.5rem_center]',
          sizes[size],
          className
        )}
        onChange={(e) => {
          onChange?.(e)
          onValueChange?.(e.target.value)
        }}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

// Utility components that now simply render children
function SelectGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectValue({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function SelectTrigger({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function SelectContent({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function SelectLabel({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <optgroup label={typeof children === 'string' ? children : ''} className={className} />;
}

interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function SelectItem({ value, children, disabled }: SelectItemProps) {
  return (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  );
}

function SelectSeparator() {
  return null;
}

function SelectScrollUpButton() {
  return null;
}

function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
