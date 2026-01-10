"use client";

import {
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { api } from "@workspace/backend/_generated/api";
import { useAction, useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { WidgetHeader } from "../components/widget-header";
import { contactSessionIdAtomFamily } from "@/modules/widget/atoms/widget-atoms";

type Initstep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<Initstep>("org");
  const [sessionValid, setSessionValid] = useState(false);

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);

  const contactSessionsId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

  //step 1 : validate organization
  const validateOrganization = useAction(api.public.organizations.validate);
  useEffect(() => {
    if (step !== "org") return;
    setLoadingMessage("Finding organization ID...");
    if (!organizationId) {
      setErrorMessage("Organization ID is required.");
      setScreen("error");
      return;
    }
    setLoadingMessage("Validating organization...");
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId!);
          setStep("session");
        } else {
          setErrorMessage(`Invalid organization: ${result.reason}`);
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Failed to validate organization.");
        setScreen("error");
      });
  }, [step, organizationId, setErrorMessage, setScreen, validateOrganization, setOrganizationId, setLoadingMessage, setStep]);

  //step 2: validate session if exists
  const validateContactSession = useMutation(api.public.contactSessions.validate);
  useEffect(() => {
    if (step !== "session") {
      return ;
    };

    setLoadingMessage("Finding contact session ...");
    if (!contactSessionsId) {
      setSessionValid(false);
      setStep("done");
      return
    }
    setLoadingMessage("Validating session...");

    validateContactSession({ contactSessionId: contactSessionsId,

     }) 
      .then((result) => {
        setSessionValid(result.valid);
        setStep("done");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("done");
      });
  }, [step, contactSessionsId, validateContactSession, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionsId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionsId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-start gap-y-2 py-6 font-sans font-bold">
          <p className="text-3xl text-foreground">Hi There</p>
          <p className="text-lg text-foreground">How can we help you today?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-col flex-1 items-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
};
