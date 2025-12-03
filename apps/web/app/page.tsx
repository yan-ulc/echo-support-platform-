"use client"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api";
import { use } from "react"

export default function Page() {
  const user = useQuery(api.users.getMany)
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
            <p>apps/web</p>
      </div>
    </div>
  )
} 
 