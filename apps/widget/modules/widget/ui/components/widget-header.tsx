import { Children } from "react";
import { cn } from "@workspace/ui/lib/utils";

export const WidgetHeader = ({
    children,
    className,
}:{
    children: React.ReactNode
    className?: string
}) => {
    return (
        <header className= {cn ("flex flex-col bg-background ring-offset-primary ring-accent  shadow p-4 text-primary-foreground rounded-b-lg " , className,
        )}>
            {children}
        </header>
    )
}