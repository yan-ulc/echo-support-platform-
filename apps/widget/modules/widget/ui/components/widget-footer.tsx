import { Button } from "@workspace/ui/components/button"
import { HomeIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export const WidgetFooter = () => {
    const screen = "selection"
    return (
        <footer className="flex items-center justify-between border-t bg-background">
            <Button
                className="h-14 flex-1 rounded-none"
                onClick={() => {}}
                size ="icon"
                variant="ghost"
        >
                <HomeIcon 
                className= {cn ("size-5", screen === "selection" && "text-primary")}
                />
            </Button>
        </footer>
    )
}
