"use client";

import { Loader2 } from "lucide-react";

type LoadingProps = {
  size?: "small" | "medium" | "large";
  text?: string;
};

export function Loading({ size = "medium", text }: LoadingProps) {
  const sizeMap = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeMap[size]} animate-spin text-red-600 mb-2`} />
      {text && <p className="text-zinc-400 text-sm">{text}</p>}
    </div>
  );
}
