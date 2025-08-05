import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { BillingInterval } from "@shopify/shopify-api";
import { getSubscriptionDetails } from "./routes/graphql/query.jsx";

export const MONTHLY_PLAN = "Monthly Plan";

const billingConfig = {
  [MONTHLY_PLAN]: {
    lineItems: [
      {
        amount: 2,
        currency: "USD",
        interval: BillingInterval.Every30Days,
        trialDays: 1,
      },
    ],
  },
};

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  billing: billingConfig,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

async function handleSubscriptionUpdate(payload) {
  const subscriptionId = payload.admin_graphql_api_id;

  if (!subscriptionId) {
    console.error("No subscription ID in webhook payload");
    return;
  }

  const subscription = await getSubscriptionDetails(admin, subscriptionId);

  if (!subscription) {
    console.error("Failed to fetch subscription details.");
    return;
  }

  // update database with retrieved subscription details

  await prisma.subscription.update({
    where: { shop: payload.myshopify_domain },
    data: {
      status: subscription.status,
      trialEnds: null,
      renewsAt: new Date(subscription.currentPeriodEnd),
      planId: subscription.lineItems[0].plan.id,
    },
  });
}

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
