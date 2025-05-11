import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Postcardloader({ compact = false }) {
  return (
    <Card className="w-full border-gray-800 bg-black mb-4 overflow-hidden">
      <div className={`flex ${compact ? 'flex-row' : 'flex-col'}`}>
        {compact && (
          <div className="flex flex-col items-center bg-gray-900 p-2 min-w-[40px] space-y-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        )}
        
        <div className="flex-1">
          <CardHeader className={`pb-2 ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}>
            <div className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className={`mt-2 ${compact ? 'h-4 w-40' : 'h-5 w-60'}`} />
          </CardHeader>

          {!compact && (
            <CardContent className="px-4 py-2 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
          )}

          <CardFooter className={`flex items-center justify-between ${compact ? 'px-3 py-2' : 'px-4 py-3'} border-t border-gray-800`}>
            {!compact && (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-10 rounded-md" />
              <Skeleton className="h-6 w-10 rounded-md" />
              <Skeleton className="h-6 w-10 rounded-md" />
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
