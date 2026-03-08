import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

export const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "resolved") {
    return (
      <Hint text="Mark as unresolved">
        <Button disabled={disabled} onClick={onClick} size="sm" variant="terriary">
          <CheckIcon className="h-4 w-4" />
          Resolved
        </Button>
      </Hint>
    );
  }
  if (status === "escalated") {
    return (
      <Hint text="Mark as resolved">
        <Button onClick={onClick} size="sm" variant="warning">
          <ArrowUpIcon className="h-4 w-4" />
          Escalated
        </Button>
      </Hint>
    );
  }
    return (
      <Hint text="Mark as escalated">
        <Button onClick={onClick} size="sm" variant="destructive">
          <ArrowRightIcon className="h-4 w-4" />
          Unresolved
        </Button>
      </Hint>
    );
  }

  

