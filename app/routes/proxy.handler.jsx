import {json} from "@remix-run/node";
import crypto from "crypto";
import {getSubscriptionStatus} from "./graphql/query.jsx";



export const loader = async ({ request }) => {

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    const isValid = validateShopifyProxyHMAC(request);
    if (!isValid) {
        return new Response('HMAC validation failed',{
            status: 401,
            statusText: 'Unauthorized',
            headers:{'Content-Type': 'application/json'},
        })
    }

    const shop = url.searchParams.get('shop');

    const instefeedData = url.searchParams.has('dataset');

    if (instefeedData){
        const isSubscribe = await checkSubscriptionStatus(shop);

        if (isSubscribe || process.env.BYPASS_SUBSCRIPTION === "true"){
            return await handleInstagramSelectedData()
        }

        if (!isSubscribe && process.env.BYPASS_SUBSCRIPTION === "true"){
            return json({isSubscribe});
        }
    }else{
        return new Response('Not Found', { status: 404 });
    }

    return null;
}

const handleInstagramSelectedData = async () => {

    const { getAllInstagramPostbyCondition } = await import("../db.server.js");
    const { default: prisma } = await import("../db.server.js");

    // Get posts with their products
    const postsWithProducts = await prisma.instagramPost.findMany({
        where: {
            selected: true,
        },
        include: {
            products: true, // Include the product relationships
        },
        orderBy: {
            timestamp: 'desc',
        },
    });

    // Transform the data to include product info
    const transformedPosts = postsWithProducts.map(post => ({
        ...post,
        products: post.products.map(product => ({
            id: product.productId,
            title: product.productTitle,
            handle: product.productHandle,
            image: product.productImage,
            price: product.productPrice,
        })),
    }));

    return json(
        {
            posts: transformedPosts,
            isSubscribe:true
        },
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
            },
        },
    );
};


const checkSubscriptionStatus = async (shop)=>{
    const {unauthenticated} = await import("../shopify.server.js");

    const {session, admin } = await unauthenticated.admin(shop);
    // const shop = session.shop;
    const {data} = await getSubscriptionStatus(admin)
    const activeSubscriptions = data.currentAppInstallation?.activeSubscriptions?.[0];

    const isSubscribe = activeSubscriptions?.status === "ACTIVE";
    return isSubscribe;
}


function validateShopifyProxyHMAC(request){
    try{
        const url = new  URL(request.url);
        const signature = url.searchParams.get("signature");

        if (!signature) return false;

        if (!process.env.SHOPIFY_API_SECRET){
            return false;
        }

        const params = new URLSearchParams(url.search);
        params.delete("signature");

        // Sort parameters alphabetically
        const sortedParams = Array.from(params.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('');



        const calculatedHmac = crypto
            .createHmac('sha256', process.env.SHOPIFY_API_SECRET).update(sortedParams)
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(calculatedHmac, 'hex')
        );

    }catch(e){
        console.error('HMAC validation error:', e.message);
        return false;
    }
}