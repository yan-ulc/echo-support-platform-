"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { Children } from 'react';
import { text } from 'stream/consumers';

interface HintProps {
 children : React.ReactNode;
 text: string;
 side?: "top" | "right" | "bottom" | "left";
 align?: "start" | "center" | "end";
}

export const Hint = ({
    children,
    text,
    side = "top",
    align = "center",
}: HintProps) => { 
    return (
        <TooltipProvider>
            <Tooltip>   
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
     )
 }