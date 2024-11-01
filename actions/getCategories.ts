import { db } from "@/lib/db"
import { Category } from "@prisma/client";

// I'm using Next.js server actions instead of api GET endèpoints
export const getCategories = async () : Promise<Category[]> => {
    try{
        const categories = await db.category.findMany({
            orderBy:{
                name: "asc"
            }
        });

        return categories;
    }catch(error: any){
        console.log("[actions/getCategories.ts] Error:", JSON.stringify(error))
        return []
    }
}