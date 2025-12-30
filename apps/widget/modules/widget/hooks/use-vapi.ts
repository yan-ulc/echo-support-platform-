import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TansriptMessage {
  role: "user" | "assistant";
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TansriptMessage[]>([]);

  useEffect(() => {
    const vapiInstance = new Vapi("d5709f96-af32-4587-8b7c-d7d44f043622");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapiInstance.on("error", (err) => {
      setIsConnecting(false);
      console.log(err, "Vapi error");
    });

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });
    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const starCall = () => {
    setIsConnecting(true);

    if (vapi) {
      vapi.start("5310c159-19cb-419f-9a99-ed82fa79b861");
    }
  };

    const endCall = () => {
        if (vapi) {
            vapi.stop();
        }
    }
  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    starCall,
    endCall,
  };
};