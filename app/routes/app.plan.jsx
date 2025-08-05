import { Banner, Layout, Page, Card, BlockStack, List, Button, Text} from '@shopify/polaris';
import { authenticate} from "../shopify.server.js";
import {useActionData, useLoaderData, useSubmit} from "@remix-run/react";
import {appSubscriptionCancel, getSubscriptionStatus} from "./graphql/query.jsx";
import {redirect} from "@remix-run/node";



export const loader = async ({request})=>{
    const {admin, session} = await authenticate.admin(request);
    const shop = session.shop;

    if (!session?.shop){
        throw redirect("/auth");
    }

    const BYPASS_SUBSCRIPTION = process.env.BYPASS_SUBSCRIPTION === "true" || false;

    if (BYPASS_SUBSCRIPTION) {
        return {
            isActive: true,
            isBypassEnabled: true,
            activeSubscription: {
                name: "Free Plan",
                status: "ACTIVE",
                createdAt: new Date().toISOString(),
                currentPeriodEnd: null,
                trialDays: 0
            },
            isTrialActive: false,
            subscriptionEndDate: "Never expires",
            shop
        };
    }

    const {
        data: {
            currentAppInstallation: { activeSubscriptions },
        },
    } = await getSubscriptionStatus(admin);


    console.log("activeSubscriptions", activeSubscriptions);

    if (activeSubscriptions.length <= 0) {
        return {
            isActive: false,
            shop
        };
    }

    const subscription = activeSubscriptions[0];
    const currentDate = new Date();
    const creationDate = new Date(subscription?.createdAt);
    const trialDays = subscription?.trialDays || 0;

    const trialEndDate = trialDays > 0 ? new Date(creationDate) : null;
    if (trialEndDate){
        trialEndDate.setDate(trialEndDate.getDate() + trialDays);
    }

    const isTrialActive = trialEndDate && currentDate < trialEndDate;


    return {   isActive: true,
        activeSubscription: subscription,
        isTrialActive,
        trialEndDate: trialEndDate.toLocaleDateString(),
        subscriptionEndDate: new Date(subscription?.currentPeriodEnd).toLocaleDateString()
    };

}

export const action = async ({request})=>{
    const {admin, session} = await authenticate.admin(request);
    const formData = await request.formData();
    const cancelSubscription = JSON.parse(formData.get("cancel"));

    if (cancelSubscription){
        const id = formData.get("id");
        const subscriptionType = formData.get("subscriptionType");
        const response = await appSubscriptionCancel(admin, id);

        const {
            appSubscriptionCancel:{userErrors}
        } = response;

        if (userErrors.length > 0){
            return{
                error: userErrors[0].message
            }
        }

        return {
            success: true,
            message: subscriptionType === 'trial'
                ? "Trial subscription cancelled successfully"
                : "Paid subscription cancelled successfully",
            cancelledAt: new Date().toISOString()
        };
    }

    return null;
}

export default function Plan(){
    const {isActive, activeSubscription, isTrialActive, trialEndDate, subscriptionEndDate, shop, isBypassEnabled} = useLoaderData();
    const actionData = useActionData();
    const submit = useSubmit();

    const getBannerContent = ()=>{
        if (isBypassEnabled){
            return {
                title: "Free Plan Active",
                status: "success",
                content: "You are currently on the Free Plan with full access to all features."
            };
        }

        if (!isActive){
            return {
                title: "No active subscription",
                status: "critical",
                content: "Your subscription is not active. Please subscribe to continue using the service."
            };
        }

        if (isTrialActive){
            return {
                title: "Trial Active",
                status: "info",
                content: `Your trial period is active until ${trialEndDate}`
            }
        }

        return {
            title: "Subscription Active",
            status: "success",
            content: `Your subscription is active until ${subscriptionEndDate}`
        }
    }

    const bannerInfo = getBannerContent();

    return (
        <Page title={"Subscription status"}>
            <Layout>
                <Layout.Section>
                    <Banner title={bannerInfo.title} status={bannerInfo.status} secondaryAction={isActive && !isBypassEnabled ? {
                        content:"Cancel Subscription",
                        onAction:()=> submit({
                            cancel:true,
                            id: activeSubscription?.id,
                            subscriptionType: isTrialActive ? 'trial' : 'paid'
                        },{
                            method:'POST'
                        })
                    } : undefined}>
                    <p>
                        {
                            bannerInfo.content
                        }
                    </p>
                    </Banner>
                </Layout.Section>
                <Layout.Section>
                    <Card sectioned>
                        <BlockStack gap={"4"}>
                            <Text as={"h2"} variant={"headingMd"}>
                                {
                                    isBypassEnabled ? "Free Plan" : (isActive ? "Manage Your Subscription" : "Subscription to Instafeed app")
                                }
                            </Text>
                            {
                                isBypassEnabled ? (
                                    <>
                                        <Text as={'p'}>
                                            You are currently enjoying our Free Plan with unlimited access to all features.
                                        </Text>
                                        <List type={"bullet"}>
                                            <List.Item>
                                                Connect Instagram business accounts with OAuth authorization
                                            </List.Item>
                                            <List.Item>
                                                Support for multiple Instagram accounts
                                            </List.Item>
                                            <List.Item>
                                                Display and select between connected accounts
                                            </List.Item>
                                            <List.Item>
                                                Unlimited posts and media access
                                            </List.Item>
                                        </List>
                                        <Text as={'p'}>
                                            Plan Status: <strong>Active</strong> | Expires: <strong>Never</strong>
                                        </Text>
                                    </>
                                ) : (
                                    !isActive && (
                                        <>
                                            <Text as={'p'}>
                                                Get full access to all  features with our affordable monthly plan.
                                            </Text>
                                            <List type={"bullet"}>
                                                <List.Item>
                                                    Connect Instagram business accounts with OAuth authorization
                                                </List.Item>
                                                <List.Item>
                                                    Support for multiple Instagram accounts
                                                </List.Item>
                                                <List.Item>
                                                    Display and select between connected accounts
                                                </List.Item>
                                            </List>
                                            <Text as={'p'}>
                                                Only $2/month with 7-day free trial.
                                            </Text>
                                        </>
                                    )
                                )
                            }
                            {!isBypassEnabled && (
                                <Button primary={!isActive} target={"_top"} url={`
                                https://admin.shopify.com/charges/tagged-banner/pricing_plans
                                `}>
                                    {
                                        isActive ? "Manage Subscription" : "Subscribe Now"
                                    }
                                </Button>
                            )}
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )


}