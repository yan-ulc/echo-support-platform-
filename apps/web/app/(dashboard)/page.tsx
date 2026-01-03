"use client"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.users.getMany)
  const addUser = useMutation(api.users.add)
  return (
  
      <div className="flex flex-col items-center justify-center min-h-svh">
          <p>apps/web</p>
          <UserButton />
          <OrganizationSwitcher hidePersonal/>
          <Button onClick= {() => addUser()}>Add User</Button>
          
        </div>

  )
} 
 
// "use client";
// import { SignIn, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// export default function Page() {
//   return (
//     <div className="p-6">
//       <SignedIn>
//         <p>signed in</p>
//         <UserButton />
//       </SignedIn>
//       <SignedOut>
//         <p>signed out</p>
//         <SignIn />
//       </SignedOut>
//     </div>
//   );
// }
