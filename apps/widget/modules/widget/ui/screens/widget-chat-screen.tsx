"use client";


import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import {  ArrowLeftIcon, Icon, MenuIcon } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { conversationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { organizationIdAtom } from "@/modules/widget/atoms/widget-atoms";
import { contactSessionIdAtomFamily } from "@/modules/widget/atoms/widget-atoms";



export const WidgetChatScreen = () => {

  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
  const conversation = useQuery(
    api.public.conversations.getOne, 
    conversationId&&contactSessionId?{
      conversationId, contactSessionId}: "skip");
  const onBack = () => {
    setScreen("selection");
    setConversationId(null);
  }

  return (
    <>
      <WidgetHeader className="flex flex-items-center justify-beetween">
        <div className="flex flex-items-center gap-x-2">
          <Button size="icon" variant="transparent">
            <ArrowLeftIcon />
          </Button>
          <p>chat</p>
        </div>
        <Button onClick={onBack} size="icon" variant="transparent">
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <div className="flex flex-col flex-1r gap-y-4 p-4  ">
        {JSON.stringify(conversation)}
      </div>
    </>
  );
};
