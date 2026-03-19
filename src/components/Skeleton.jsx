const Skeleton = ({ className }) => {
  return (
    <div className={`skeleton ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="glass-card p-6 md:p-8 space-y-6">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="pt-6 border-t border-glass-border flex justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="space-y-8 md:space-y-12">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-32 sm:w-40" />
      <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
    </div>
    <div className="glass-card p-6 sm:p-10 md:p-16 space-y-8 md:space-y-12">
      <div className="flex flex-col items-center space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-32 sm:w-40" />
        <Skeleton className="h-12 sm:h-16 w-3/4" />
        <Skeleton className="h-5 w-24 sm:w-32" />
      </div>
      <div className="space-y-3 md:space-y-4 flex flex-col items-center">
        <Skeleton className="h-4 w-full max-w-xs sm:max-w-md" />
        <Skeleton className="h-4 w-full max-w-xs sm:max-w-md" />
        <Skeleton className="h-4 w-full max-w-xs sm:max-w-md" />
        <Skeleton className="h-4 w-3/4 max-w-xs sm:max-w-md" />
      </div>
      <div className="pt-6 md:pt-8 border-t border-glass-border flex justify-center gap-6 md:gap-8">
        <Skeleton className="h-10 w-20 sm:w-24" />
        <Skeleton className="h-10 w-20 sm:w-24" />
      </div>
    </div>
  </div>
);

export default Skeleton;
