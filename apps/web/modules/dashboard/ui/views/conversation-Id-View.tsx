"use client";
import { toUIMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Button } from "@workspace/ui/components/button";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { Form, FormField } from "@workspace/ui/components/form";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { cn } from "@workspace/ui/lib/utils";
import {
  useAction,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ConversationStatusButton } from "../components/conversqation-status-buttton";

const schema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const conversation = useQuery(api.private.conversation.getOne, {
    conversationId,
  });

  const messages = usePaginatedQuery(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation?.threadId } : "skip",
    { initialNumItems: 10 },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadsize: 10,
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  const messageValue = form.watch("message");

  const [isEnhancing, setIsEnhancing] = useState(false);
  const enhanceResponse = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceResponse = async () => {
    const currentValue = form.getValues("message");

    if (!currentValue || currentValue.trim().length === 0) {
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await enhanceResponse({ prompt: currentValue });

      form.setValue("message", response, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (error) {
      console.error("Error enhancing response:", error);
    } finally {
      setIsEnhancing(false);
    }
  };
  const createMessage = useMutation(api.private.messages.create);
  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await createMessage({ conversationId, prompt: values.message });

      form.reset();
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };
  const [isUpdatetingStatus, setIsUpdatingStatus] = useState(false);
  const updateConversationStatus = useMutation(
    api.private.conversation.updateStatus,
  );
  const handleToggleStatus = async () => {
    if (!conversation) {
      return;
    }

    setIsUpdatingStatus(true);

    let newStatus: "unresolved" | "escalated" | "resolved";

    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }
    try {
      await updateConversationStatus({ conversationId, status: newStatus });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (conversation === undefined  || messages.status === "LoadingFirstPage") {
    return < ConversationIdViewLoading/>;
  }

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button variant="ghost" size="sm">
          <MoreHorizontalIcon />
        </Button>
        <ConversationStatusButton
          onClick={handleToggleStatus}
          status={conversation?.status ?? "unresolved"}
          disabled={isUpdatetingStatus}
        />
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />

          {toUIMessages(messages?.results ?? [])
            .reverse()
            .map((message) => (
              <AIMessage
                from={message.role === "user" ? "assistant" : "user"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>
                {message.role === "user" && (
                  <DicebearAvatar
                    seed={conversation?.contactSessionId ?? "user"}
                    size={32}
                  />
                )}
              </AIMessage>
            ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  {...field}
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting
                    //TODO NATI
                  }
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "Conversation is resolved."
                      : "Type your message as operator here..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton
                  type="button"
                  onClick={handleEnhanceResponse}
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhancing ||
                    !messageValue?.trim()
                  }
                >
                  <Wand2Icon className="h-4 w-4" />
                  <span>{isEnhancing ? "Enhancing..." : "Enhance"}</span>
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhancing
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};

export const ConversationIdViewLoading = () => {
  return (
    <div className="flex h-full flex-col bg-muted">
      <div>
        <header className="flex items-center justify-between border-b bg-background p-2.5">
          <Button disabled size="sm" variant="ghost">
            <MoreHorizontalIcon />
          </Button>
        </header>
        <AIConversation className="max-h-[calc(100vh-180px)]">
          <AIConversationContent>
            {Array.from({ length: 8 }).map((_, index) => {
              const isUser = index % 2 === 0;
              const widths = ["w-48", "w-60", "w-72"];
              const width = widths[index % widths.length];

              return (
                <div
                  className={cn(
                    "group flex w-full items-end gap-2 [&>div]:max-w-[80%]",
                    isUser ? "is-user" : "is-assistant flex-row-reverse",
                  )}
                  key={index}
                >
                  <Skeleton
                    className={`h-9 ${width} rounded-lg bg-primary-foreground`}
                  />
                  <Skeleton className="size-8 rounded-full bg-primary-foreground" />
                </div>
              );
            })}
          </AIConversationContent>
        </AIConversation>
        <div className="p-2">
          <AIInput>
            <AIInputTextarea
            disabled
            placeholder="type your response as operator"
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputSubmit disabled status="ready" type="button"/>
              </AIInputTools>
              <AIInputSubmit disabled status="ready" type="submit" />
            </AIInputToolbar>
          </AIInput>
        </div>
        
      </div>
    </div>
  );
};
