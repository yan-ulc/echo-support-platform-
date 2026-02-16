import { Button } from "@workspace/ui/components/button"
import { HomeIcon, InboxIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useAtomValue, useSetAtom } from "jotai"
import { screenAtom } from "../../atoms/widget-atoms"

export const WidgetFooter = () => {
    const screen = useAtomValue(screenAtom)
    const setscreen = useSetAtom(screenAtom)
    return (
        <footer className="flex items-center justify-between border-t bg-background">
            <Button
                className="h-14 flex-1 rounded-none"
                onClick={() => setscreen("selection")}
                size ="icon"
                variant="ghost"
            >
                <HomeIcon
                className= {cn ("size-5", screen === "selection" && "text-primary")}
                />
            </Button>
            <Button
            className="h-14 flex-1"
            size="icon"
            variant="ghost"
            onClick={() => setscreen("inbox")}
            >
            <InboxIcon
                className={cn("size-5", screen === "inbox" && "text-primary")}
            />
            </Button>
        </footer>
    )
}
