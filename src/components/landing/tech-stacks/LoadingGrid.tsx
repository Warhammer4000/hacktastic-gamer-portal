import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center justify-items-center">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full max-w-[240px] aspect-square p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
        >
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ))}
    </div>
  );
};