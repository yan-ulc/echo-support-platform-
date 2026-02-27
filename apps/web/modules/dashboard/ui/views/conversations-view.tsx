import Image from "next/image";

export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-muted">
        <div className="flex flex-1 items-baseline-center gap-x2">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <p className="font-semibold text-lg">Echo</p>
        </div>
    </div>
  );
}