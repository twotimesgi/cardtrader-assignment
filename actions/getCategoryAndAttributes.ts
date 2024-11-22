import { db } from "@/lib/db"
import { CategoryAndAttributes } from "../types/filters";
// I'm using Next.js server actions instead of api GET endèpoints
export const getCategoryAndAttributes = async ({categoryId} : {categoryId: string}) : Promise< CategoryAndAttributes | null>=> {
    try{
        const category  : CategoryAndAttributes | null = await db.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                attributes: true
            }
        });

        return category;
    }catch(error: any){
        console.log("[actions/getCategoryAndAttributes.ts] Error:", JSON.stringify(error))
        return null;
    }
}

