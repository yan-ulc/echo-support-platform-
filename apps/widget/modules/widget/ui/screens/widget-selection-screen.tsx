"use client";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { contactSessionIdAtomFamily, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { api } from "@workspace/backend/_generated/api";
import { useMutation } from "convex/react";
import { conversationIdAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {

  const setScreen = useSetAtom(screenAtom)
  const organizationId = useAtomValue(organizationIdAtom)
  const setErrorMassage = useSetAtom(errorMessageAtom)
  const setConversationId = useSetAtom(conversationIdAtom)
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || "")
  )

  const createConversation = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }
    if (!organizationId) {
      setScreen("error");
      setErrorMassage("Organization ID is missing.");
      return;
    }
    setIsPending(true);

    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch  {
      setScreen("auth");
    }
    finally {
      setIsPending(false);
    }

    
  };



  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-start gap-y-2 py-6 font-sans font-bold">
          <p className="text-3xl text-foreground">Hi There</p>
          <p className="text-lg text-foreground">How can we help you today?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col flex-1 items-center justify-center gap-y-4 p-4 overflow-auto">
        <Button
          className=" h-15 justify-between bg-primary text-primary-foreground hover:bg-primary/90  max-w-md hover:text-primary-foreground/90"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-4 text-primary-foreground" />
            <span>Start Chat</span>
          </div>
          <ChevronRightIcon />
        </Button>
      </div>
      <WidgetFooter />
    </>
  );
};
