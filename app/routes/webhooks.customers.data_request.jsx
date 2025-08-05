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
    const topic = request.headers.get("X-Shopify-Topic") || "customers/data_request";
    
    console.log(`Received ${topic} webhook:`, payload);

    // Extract customer information from payload
    const customerId = payload.customer?.id;
    const shopDomain = payload.shop_domain || payload.shop?.myshopify_domain;
    const customerEmail = payload.customer?.email;
    const customerPhone = payload.customer?.phone;

    if (!customerId && !customerEmail) {
      console.error("No customer ID or email provided in webhook payload");
      return json({ error: "Invalid payload" }, { status: 400 });
    }

    // Log the data request for compliance
    console.log(`Processing customer data request:`, {
      customerId,
      customerEmail,
      shopDomain,
      timestamp: new Date().toISOString(),
      webhook: topic
    });

    // Collect customer data related to Instagram integration
    // Note: Since Instagram accounts aren't directly linked to customer IDs,
    // we'll collect all data for the shop and flag for manual review
    
    const { getAllInstagramAccounts } = await import("../db.server.js");
    const instagramAccounts = await getAllInstagramAccounts();
    const customerDataReport = {
      requestInfo: {
        customerId,
        customerEmail,
        customerPhone,
        shopDomain,
        requestDate: new Date().toISOString(),
        webhook: topic
      },
      instagramData: {
        note: "Instagram accounts are not directly linked to customer IDs. Manual review required.",
        totalAccounts: instagramAccounts.length,
        accounts: instagramAccounts.map(account => ({
          accountId: account.id,
          instagramUsername: account.instagramUsername,
          accountType: account.accountType,
          connectedAt: account.createdAt,
          lastUpdated: account.updatedAt,
          totalPosts: account.posts?.length || 0
        }))
      },
      dataCategories: {
        personalData: {
          description: "No direct personal data stored. Instagram usernames and business account info only.",
          items: instagramAccounts.map(acc => acc.instagramUsername).filter(Boolean)
        },
        contentData: {
          description: "Instagram posts and media URLs",
          count: instagramAccounts.reduce((total, acc) => total + (acc.posts?.length || 0), 0)
        },
        linkingData: {
          description: "Product links between Instagram posts and Shopify products",
          note: "These links help customers discover products from Instagram posts"
        }
      },
      compliance: {
        dataRetention: "Data is retained until account disconnection or app uninstall",
        dataSharing: "Data is not shared with third parties except as required for Instagram API functionality",
        userRights: "Users can delete data by disconnecting Instagram account or uninstalling app"
      }
    };

    // In production, you should:
    // 1. Store this report in a secure location
    // 2. Send it to the customer via email
    // 3. Log the data request fulfillment
    // 4. Set up automated expiration of the report

    console.log("Customer data request fulfilled:", {
      customerId,
      reportGenerated: true,
      dataCategories: Object.keys(customerDataReport.dataCategories),
      timestamp: new Date().toISOString()
    });

    return json({ 
      success: true, 
      message: "Customer data request processed",
      report: customerDataReport
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing customer data request webhook:", error);
    
    // Log error for compliance review
    const errorLog = {
      error: error.message,
      timestamp: new Date().toISOString(),
      webhook: "customers/data_request",
      status: "failed"
    };
    
    console.error("Customer data request webhook failed:", errorLog);
    
    return json({ 
      error: "Failed to process data request",
      details: error.message 
    }, { status: 500 });
  }
};

// Handle GET requests for debugging
export const loader = async () => {
  return json({ 
    message: "Customer data request webhook endpoint",
    method: "POST",
    description: "Handles customer data access requests for GDPR compliance"
  });
};