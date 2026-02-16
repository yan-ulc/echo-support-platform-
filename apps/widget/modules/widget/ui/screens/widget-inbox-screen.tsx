"use client";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const seetscreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 5 },
  );

  const { topElementRef, canLoadMore, isLoadingMore, handleLoadMore } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadsize: 5,
      observerEnabled: false,
    });

  return (
    <>
      <WidgetHeader className="bg-primary">
        <div className="flex items-center gap-x-2">
          <Button
            variant="transparent"
            size="icon"
            onClick={() => seetscreen("selection")}
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-3 p-4 overflow-y-auto">
        {conversations?.results.length > 0 &&
          conversations?.results.map((conversation) => (
            <Button
              className="h-24 w-full p-4 flex flex-col justify-between"
              key={conversation._id}
              variant="outline"
              onClick={() => {
                setConversationId(conversation._id);
                seetscreen("chat");
              }}
            >
              <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                {/* Top Left: Title */}
                <div className="flex items-start justify-start">
                  <span className="text-foreground text-md font-semibold  tracking-wider">
                    Chat
                  </span>
                </div>

                {/* Top Right: Time + Status Stack */}
                <div className="flex flex-col items-end justify-start leading-none gap-1 text-lg">
                  <span className="text-muted-foreground text-[14px] whitespace-nowrap">
                    {formatDistanceToNow(new Date(conversation._creationTime), {
                      addSuffix: true,
                    })}
                  </span>
                  <ConversationStatusIcon status={conversation.status} />
                </div>

                {/* Middle/Bottom: Message Content */}
                <div className="col-span-2 flex items-center pt-2">
                  <p className="truncate text-lg text-left w-full text-muted-foreground/80">
                    {conversation.lastMessage?.text || "No messages yet..."}
                  </p>
                </div>
              </div>
            </Button>
          ))}
          <InfiniteScrollTrigger
            ref={topElementRef}
            isLoadingMore={isLoadingMore}
            canLoadMore={canLoadMore}
            onLoadMore={handleLoadMore} 
          />
      </div>
      <WidgetFooter />
    </>
  );
};
