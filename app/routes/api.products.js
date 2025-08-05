import {json} from "@remix-run/node";
import {addProductToPost, removeProductFromPost, getProductsForPost} from "../db.server.js";

// Support GET requests for debugging
export async function loader({request}){
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const postId = url.searchParams.get('postId');
    const accountId = url.searchParams.get('accountId');

    if (action === 'get' && postId) {
        try {
            const products = await getProductsForPost(postId);
            return json({ success: true, data: products });
        } catch (error) {
            console.error("Product API error (GET):", error);
            return json({ success: false, error: error.message }, { status: 500 });
        }
    }

    if (action === 'getCounts' && accountId) {
        try {
            const { getProductCountsForPosts } = await import("../db.server.js");
            const counts = await getProductCountsForPosts(accountId);
            return json({ success: true, data: counts });
        } catch (error) {
            console.error("Product counts API error (GET):", error);
            return json({ success: false, error: error.message }, { status: 500 });
        }
    }

    return json({ success: false, error: "Invalid GET request" }, { status: 400 });
}

export async function action({request}){
    const formData = await request.formData();
    const action = formData.get('action');
    const postId = formData.get('postId');

    try{
        switch (action){
            case "add":{
                const productData = JSON.parse(formData.get('productData'));
                
                // Check if product is already linked to this post
                const existingProducts = await getProductsForPost(postId);
                const isAlreadyLinked = existingProducts.some(
                    product => product.productId === productData.id
                );
                
                if (isAlreadyLinked) {
                    return json({
                        success: false, 
                        error: "duplicate",
                        message: "This product is already linked to this post"
                    });
                }
                
                const result = await addProductToPost(postId, productData);
                return json({success: true, data:result});
            }


            case "remove":{
                const productId = formData.get('productId');
                await removeProductFromPost(postId, productId);
                return json({success: true});
            }


            case "get":{
                const products = await getProductsForPost(postId);
                return json({ success: true, data: products });
            }

            case "getCounts":{
                const accountId = formData.get('accountId');
                if (!accountId) {
                    return json({ success: false, error: "accountId is required" }, { status: 400 });
                }
                
                const { getProductCountsForPosts } = await import("../db.server.js");
                const counts = await getProductCountsForPosts(accountId);
                return json({ success: true, data: counts });
            }

            default:
                return json({ success: false, error: "Invalid action" }, { status: 400 });
        }


    }catch (error){
        console.error("Product API error:", error);
        return json({ success: false, error: error.message }, { status: 500 });

    }
}
