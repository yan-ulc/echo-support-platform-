"use client"
import { useVapi } from "@/modules/widget/hooks/use-vapi"
import { Button } from "@workspace/ui/components/button"
import { describe } from "node:test";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    starCall,
    endCall} = useVapi();
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
            <Button onClick={() => starCall()}>
              Start Call
            </Button>
            <Button onClick={() => endCall()} variant={"destructive"}>
              End Call
            </Button>
            <p> isConnected: {`${isConnected}`}</p>
            <p> isConnecting: {`${isConnecting}`}</p>
            <p> isSpeaking: {`${isSpeaking}`}</p>
            <p> {JSON.stringify(transcript, null, 2)}</p>
      </div>
    </div>
  )
} 
 