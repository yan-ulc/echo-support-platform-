"use client"
import { useQuery } from "convex/react"
import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { use } from "react"
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  const user = useQuery(api.users.getMany)
  return (
  <>
    <Authenticated>
      <div className="flex items-center justify-center min-h-svh">
        <div className="flex flex-col items-center justify-center gap-4">
              <p>apps/web</p>
              <UserButton />
        </div>
      </div>
    </Authenticated>
    <Unauthenticated>
       <SignInButton> Sign In </SignInButton>
      <p> Must be signed in!</p>
    </Unauthenticated>
  </>
  )
} 
 