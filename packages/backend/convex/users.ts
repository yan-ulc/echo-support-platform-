import { type } from "os";
import { query, mutation } from "./_generated/server";

export const getMany = query ({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();

        return users;




}});

export const add = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity(); 
        if (identity == null) {
            throw new Error("Not authenticated");
        }
        const orgId = identity.orgId as string 
        if (!orgId === null) {
            throw new Error (" missing orgeanization id");
        }

        throw new Error("tracking test ")
        const userId = await ctx.db.insert("users", {
            name : "yann",
        });

        return userId;

    }
})      
    

;           