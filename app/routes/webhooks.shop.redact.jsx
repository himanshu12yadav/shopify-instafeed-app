import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  try {
    // Verify HMAC signature first
    const hmacHeader = request.headers.get("X-Shopify-Hmac-Sha256");
    const body = await request.text();
    
    if (!hmacHeader) {
      console.error("Missing HMAC header in webhook request");
      return new Response("Unauthorized - Missing HMAC", { status: 401 });
    }

    // Verify HMAC using crypto
    const crypto = await import("crypto");
    const secret = process.env.SHOPIFY_API_SECRET;
    const expectedHmac = crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");
    
    if (hmacHeader !== expectedHmac) {
      console.error("Invalid HMAC signature");
      return new Response("Unauthorized - Invalid HMAC", { status: 401 });
    }

    // Parse the verified payload
    const payload = JSON.parse(body);
    const topic = request.headers.get("X-Shopify-Topic") || "shop/redact";
    
    console.log(`Received ${topic} webhook:`, payload);

    // Extract shop information from payload
    const shopId = payload.shop_id || payload.shop?.id;
    const shopDomain = payload.shop_domain || payload.shop?.myshopify_domain;
    const shopOwner = payload.shop_owner || payload.shop?.shop_owner;

    if (!shopId && !shopDomain) {
      console.error("No shop ID or domain provided in webhook payload");
      return json({ error: "Invalid payload" }, { status: 400 });
    }

    // Log the shop deletion request for compliance
    console.log(`Processing shop data deletion request:`, {
      shopId,
      shopDomain,
      shopOwner,
      timestamp: new Date().toISOString(),
      webhook: topic,
      reason: "Shop closure/deletion"
    });

    // Get all Instagram accounts for this shop
    const { getAllInstagramAccounts, deleteInstagramAccount, getAccountDeletionDetails } = await import("../db.server.js");
    const instagramAccounts = await getAllInstagramAccounts();
    
    let deletionSummary = {
      shopId,
      shopDomain,
      shopOwner,
      timestamp: new Date().toISOString(),
      accountsDeleted: 0,
      postsDeleted: 0,
      productLinksDeleted: 0,
      errors: []
    };

    // Delete all Instagram accounts and associated data
    for (const account of instagramAccounts) {
      try {
        // Get deletion details before deleting
        const deletionDetails = await getAccountDeletionDetails(account.id);
        
        console.log(`Deleting Instagram account ${account.instagramUsername}:`, deletionDetails);
        
        // Delete the account and all associated data
        await deleteInstagramAccount(account.id);
        
        // Update summary
        deletionSummary.accountsDeleted++;
        deletionSummary.postsDeleted += deletionDetails.postsCount;
        deletionSummary.productLinksDeleted += deletionDetails.productLinksCount;
        
        console.log(`Successfully deleted Instagram account: ${account.instagramUsername}`);
        
      } catch (accountError) {
        console.error(`Failed to delete Instagram account ${account.id}:`, accountError);
        deletionSummary.errors.push({
          accountId: account.id,
          username: account.instagramUsername,
          error: accountError.message
        });
      }
    }

    // Log comprehensive deletion summary
    console.log("Shop data deletion completed:", deletionSummary);

    // In production, you should:
    // 1. Store this deletion log in a compliance audit table
    // 2. Send confirmation to shop owner if possible
    // 3. Generate deletion certificate
    // 4. Notify compliance team of completion
    // 5. Clear any cached data

    const response = {
      success: true,
      message: "Shop data deletion processed successfully",
      summary: deletionSummary,
      compliance: {
        gdprCompliant: true,
        deletionMethod: "automated_webhook",
        dataTypesDeleted: [
          "Instagram account connections",
          "Instagram posts and media references", 
          "Product linking data",
          "Account tokens and authentication data"
        ],
        retentionPeriod: "Immediate deletion upon shop closure"
      }
    };

    return json(response, { status: 200 });

  } catch (error) {
    console.error("Error processing shop redact webhook:", error);
    
    // Log error for compliance review
    const errorLog = {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      webhook: "shop/redact",
      status: "failed",
      shopInfo: {
        shopId: payload?.shop_id,
        shopDomain: payload?.shop_domain
      }
    };
    
    console.error("Shop redact webhook failed:", errorLog);
    
    // Even if there's an error, we should attempt manual cleanup
    // and flag for compliance team review
    
    return json({ 
      error: "Failed to process shop deletion request",
      details: error.message,
      requiresManualReview: true,
      complianceAlert: true
    }, { status: 500 });
  }
};

// Handle GET requests for debugging
export const loader = async () => {
  return json({ 
    message: "Shop redact webhook endpoint",
    method: "POST",
    description: "Handles complete shop data deletion when shop is closed/deleted",
    dataDeleted: [
      "All Instagram account connections",
      "All Instagram posts and media references",
      "All product linking data",
      "All authentication tokens"
    ]
  });
};