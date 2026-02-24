"use client";
import { getConuntryFromTimezone, getFlagUrl } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { cn } from "@workspace/ui/lib/utils";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai/react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeft,
  ListIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { statusFilterAtom } from "../../atom";

export const ConversationsPanel = () => {
  const pathName = usePathname();
  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const conversations = usePaginatedQuery(
    api.private.conversation.getMany,
    { status: statusFilter === "all" ? undefined : statusFilter },
    { initialNumItems: 10 },
  );

  const {
    topElementRef,
    isLoadingMore,
    canLoadMore,
    isLoadingFirstPage,
    handleLoadMore,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadsize: 10,
  });

  console.log("Conversations object:", conversations);
  console.log("Conversations results:", conversations?.results);
  console.log("Conversations results length:", conversations?.results?.length);
  console.log("Conversations status:", conversations?.status);

  return (
    <div className="flex h-full w-full flex-col bg-primary-foreground text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select
          defaultValue="all"
          onValueChange={(value) =>
            setStatusFilter(
              value as "all" | "unresolved" | "escalated" | "resolved",
            )
          }
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>Unresolved</span>
              </div>
            </SelectItem>
            <SelectItem value="escalated">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4" />
                <span>Escalated</span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <span>Resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoadingFirstPage ? (
        <SkeletonConversations />
      ) : (
        <ScrollArea className="h-full rounded-md">
          <div className="flex w-full flex-col text-sm ">
            {!conversations?.results || conversations.results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            ) : (
              conversations.results.map((conversation) => {
                const isLastMessageFromOperator =
                  conversation.lastMessage?.message?.role !== "user";

                const country = getConuntryFromTimezone(
                  conversation.contactSession.metadata?.timezone || "UTC",
                );

                const flagUrl = country?.code
                  ? getFlagUrl(country.code)
                  : undefined;

                return (
                  <Link
                    key={conversation._id}
                    className={cn(
                      "relative flex cursor-pointer items-start  gap-3 border rounded-md p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                      pathName === `/conversations/${conversation._id}` &&
                        "bg-accent text-accent-foreground",
                    )}
                    href={`/conversations/${conversation._id}`}
                  >
                    <div
                      className={cn(
                        "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-primary opacity-0 transition-opacity",
                        pathName === `/conversations/${conversation._id}` &&
                          "opacity-100",
                      )}
                    />

                    <DicebearAvatar
                      seed={conversation.contactSession._id}
                      badgeImageUrl={flagUrl}
                      size={40}
                      className="shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex w-full items-center gap-2">
                        <span className="truncate font-bold">
                          {conversation.contactSession.name}
                        </span>
                        <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                          {formatDistanceToNow(conversation._creationTime)}k
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex w-0 grow items-center gap-1">
                          {isLastMessageFromOperator && (
                            <CornerUpLeft className="size-3 shrink-0 text-muted-foreground" />
                          )}
                          <span
                            className={cn(
                              "line-clamp-1 text-muted-foreground text-xs",
                              !isLastMessageFromOperator &&
                                "font-semibold text-foreground",
                            )}
                          >
                            {conversation.lastMessage?.text}
                          </span>
                        </div>
                        <ConversationStatusIcon status={conversation.status} />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export const SkeletonConversations = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2">
      <div className="w-full space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex w-full items-start gap-3 rounded-md border p-4 py-5"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="ml-auto h-3 w-12 rounded" />
              </div>
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
