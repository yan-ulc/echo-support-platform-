import {atom} from "jotai";
import { WidgetScreen } from "@/modules/widget/types";
import {  atomWithStorage } from "jotai/utils";
import { atomFamily } from "jotai-family";
import { Id } from "@workspace/backend/_generated/dataModel";
import { CONTACT_SESSION_KEY } from "../constants";
//basic atoms for widget state management
export const screenAtom = atom<WidgetScreen>("loading");
export const organizationIdAtom = atom<string | null>(null);

//organization scope atoms
export const contactSessionIdAtomFamily = atomFamily((organizationId: string) => { return atomWithStorage<Id<"contactSessions">| null>(`${CONTACT_SESSION_KEY}_${organizationId}`, null );});


export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null); 
