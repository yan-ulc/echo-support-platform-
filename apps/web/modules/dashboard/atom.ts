import { Doc } from "@workspace/backend/_generated/dataModel";
import { atomWithStorage } from "jotai/utils";
import { STATUS_FILTER_KEYS } from "./constant";

export const statusFilterAtom = atomWithStorage<
  Doc<"conversations">["status"] | "all"
>(STATUS_FILTER_KEYS, "all");
