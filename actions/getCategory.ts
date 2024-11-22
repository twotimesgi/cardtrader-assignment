import { db } from "@/lib/db"
import { CategoryAndAttributes } from "../types/filters";
import { Category } from "@prisma/client";
// I'm using Next.js server actions instead of api GET endèpoints
export const getCategory = async ({categoryId} : {categoryId: string}) : Promise< Category | null>=> {
    try{
        const category  : Category | null = await db.category.findUnique({
            where: {
                id: categoryId
            },    
        });

        return category;
    }catch(error: any){
        console.log("[actions/getCategory.ts] Error:", JSON.stringify(error))
        return null;
    }
}

