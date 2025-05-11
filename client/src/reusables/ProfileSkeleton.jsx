import React from "react";
import { Skeleton } from "../Components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center pb-16">
      <div className="w-full h-56 sm:h-64 relative overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="w-full relative md:-mt-16 z-10">
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 sm:-bottom-16 bg-[#121212] rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center gap-6 shadow-xl border border-[#ddff0020] max-w-5xl w-full">
          <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 rounded-full" />
          <div className="flex-1 text-center sm:text-left space-y-3">
            <Skeleton className="h-6 w-40 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-56 mx-auto sm:mx-0" />
            <div className="flex justify-center sm:justify-start gap-6 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-28 sm:pt-32" />

      <div className="w-full max-w-5xl px-4 sm:px-6 mt-8 space-y-6">
        <div className="flex gap-2 sm:gap-4 w-full rounded-lg p-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-md" />
          ))}
        </div>

        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
