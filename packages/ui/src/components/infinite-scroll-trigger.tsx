import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { forwardRef } from "react";

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoretext?: string;
  className?: string;
}

export const InfiniteScrollTrigger = forwardRef<
  HTMLDivElement,
  InfiniteScrollTriggerProps
>(
  (
    {
      canLoadMore,
      isLoadingMore,
      onLoadMore,
      loadMoreText = "Load more",
      noMoretext = "No more items",
      className,
    },
    ref,
  ) => {
    let text = loadMoreText;

    if (isLoadingMore) {
      text = "Loading...";
    } else if (!canLoadMore) {
      text = noMoretext;
    }

    return (
      <div className={cn("flex justify-center py-4", className)} ref={ref}>
        <Button
          disabled={!canLoadMore || isLoadingMore}
          onClick={onLoadMore}
          variant="outline"
          size="sm"
        >
          {text}
        </Button>
      </div>
    );
  },
);

InfiniteScrollTrigger.displayName = "InfiniteScrollTrigger";
