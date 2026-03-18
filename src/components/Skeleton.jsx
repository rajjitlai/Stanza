const Skeleton = ({ className }) => {
  return (
    <div className={`skeleton ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="glass-card p-8 space-y-6">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="flex gap-2">
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
  <div className="space-y-12">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
    <div className="glass-card p-16 space-y-12">
      <div className="flex flex-col items-center space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-4 flex flex-col items-center">
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-3/4 max-w-md" />
      </div>
      <div className="pt-8 border-t border-glass-border flex justify-center gap-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  </div>
);

export default Skeleton;
