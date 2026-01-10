"use client";

import { errorMessageAtom } from "@/modules/widget/atoms/widget-atoms";
import { useAtomValue } from "jotai";
import { WidgetHeader } from "../components/widget-header";
import { AlertTriangle, AlertTriangleIcon } from "lucide-react";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-start gap-y-2 py-6 font-sans font-bold">
          <p className="text-3xl text-foreground">Hi There</p>
          <p className="text-lg text-foreground">How can we help you today?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col flex-1 items-center gap-y-4 p-4 text-muted-foreground">
        <AlertTriangleIcon/>
        <p className="text-sm">
            {errorMessage || "invalid configuration "}
        </p>

      </div>
    </>
  );
};
