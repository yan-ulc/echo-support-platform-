import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-green-100",
  },
  unresolved: {
    icon: ArrowRightIcon,
    bgColor: "bg-destructive-100",
  },
  escalated: {
    icon: ArrowUpIcon,
    bgColor: "bg-yellow-100",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full p-5",
        config.bgColor,
      )}
    >
      <Icon className="size-5 stroke-3 text-primary" />
    </div>
  );
};
