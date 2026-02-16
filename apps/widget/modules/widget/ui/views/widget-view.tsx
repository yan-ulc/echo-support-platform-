"use client";

import { useAtomValue } from "jotai";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-error-screen";
import { WidgetLoadingScreen } from "@/modules/widget/ui/screens/widget-loading-screen";
import { WidgetSelectionScreen } from "@/modules/widget/ui/screens/widget-selection-screen";
import { WidgetChatScreen } from "../screens/widget-chat-screen";
import { WidgetInboxScreen } from "../screens/widget-inbox-screen";

interface Props {
  organizationId: string | null;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents ={
    loading:<WidgetLoadingScreen organizationId={organizationId}/>,
    error:<WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: voice</p>,
    inbox:<WidgetInboxScreen />,
    selection:<WidgetSelectionScreen />,
    chat:<WidgetChatScreen />,
    contact:<p>TODO: contact</p>,
  }
  return (
    <main className=" min-h-screen flex flex-col h-full w-full overflow-hidden  border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};
