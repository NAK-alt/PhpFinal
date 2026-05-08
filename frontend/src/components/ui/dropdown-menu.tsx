"use client";

import * as React from "react";
import { cn } from "./utils";
import { ChevronRightIcon } from "lucide-react";

// Simple dropdown menu implementation using HTML details/summary
const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

function DropdownMenu({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(open ?? false);

  return (
    <DropdownMenuContext.Provider value={{ open: isOpen, setOpen: onOpenChange ? onOpenChange : setIsOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({ 
  children, 
  asChild,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = React.useContext(DropdownMenuContext);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    props.onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownMenuContent({
  align = "start",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute mt-2 w-56 rounded-md bg-white text-foreground shadow-lg ring-1 ring-black/10 z-50",
        align === "end" ? "right-0" : "left-0",
        "dark:bg-gray-900 dark:ring-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props}>
      {children}
    </div>
  );
}

function DropdownMenuItem({
  className,
  children,
  variant = "default",
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "destructive" }) {
  const { setOpen } = React.useContext(DropdownMenuContext);

  return (
    <button
      className={cn(
        "w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center text-foreground",
        variant === "destructive" && "text-red-600 hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 dark:focus:bg-red-900/30",
        "dark:hover:bg-gray-800 dark:focus:bg-gray-800",
        className
      )}
      onClick={(e) => {
        setOpen(false);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { checked?: boolean; onChange?: (checked: boolean) => void }) {
  return (
    <label className={cn("w-full px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 focus:outline-none flex items-center gap-2 cursor-pointer", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        {...props}
      />
      {children}
    </label>
  );
}

function DropdownMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuRadioItem({
  className,
  children,
  value,
  checked,
  onChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string; checked?: boolean; onChange?: (value: string) => void }) {
  return (
    <label className={cn("w-full px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer", className)}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {children}
    </label>
  );
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-gray-200", className)} />;
}

function DropdownMenuShortcut({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("ml-auto text-xs text-gray-500", className)} {...props}>
      {children}
    </span>
  );
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 flex items-center justify-between", className)} {...props}>
      {children}
      <ChevronRightIcon className="h-4 w-4" />
    </button>
  );
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("ml-2 rounded-md bg-white shadow-lg ring-1 ring-black/10", className)} {...props}>
      {children}
    </div>
  );
}

function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
