import { cn } from "@/lib/utils";
import React from "react";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl", className)}>{children}</div>
  );
};
