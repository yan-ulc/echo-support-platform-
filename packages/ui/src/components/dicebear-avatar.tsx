"use client";

import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@workspace/ui/lib/utils";
import { useMemo } from "react";

interface DicebearAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  badgeClassName?: string;
  imageUrl?: string;
  badgeImageUrl?: string;
}

export const DicebearAvatar = ({
  seed,
  size = 32,
  className,
  badgeClassName,
  imageUrl,
  badgeImageUrl,
}: DicebearAvatarProps) => {
  const avatarSrc = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    }
    const avatar = createAvatar(glass, {
      seed: seed.toLowerCase().trim(),
      size,
    });
    return avatar.toDataUri();
  }, [seed, size, imageUrl]);

  const badgesize = Math.round(size * 0.5);

  return (
    <div
      className="relative flex shrink-0 rounded-full border-background bg-background"
      style={{ width: size, height: size }}
    >
      <Avatar
        className={cn("", className)}
        style={{ width: size, height: size }}
      >
        <AvatarImage
          alt="avatar"
          src={avatarSrc}
          className="rounded-full flex items-center"
        />
      </Avatar>
      {badgeImageUrl && (
        <div
          className={cn(
            "absolute right-0 bottom-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background",
            badgeClassName,
          )}
          style={{
            width: badgesize,
            height: badgesize,
            transform: "translate(25%, 25%)",
          }}
        >
          <img
            alt="Badge"
            className="h-full w-full object-cover"
            height={badgesize}
            src={badgeImageUrl}
            width={badgesize}
          />
        </div>
      )}
    </div>
  );
};
