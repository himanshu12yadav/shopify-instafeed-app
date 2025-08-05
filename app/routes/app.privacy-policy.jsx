import { authenticate } from "../shopify.server.js";
import {
  Card,
  Text,
  List,
  BlockStack,
  InlineStack,
  Icon,
} from "@shopify/polaris";
import {
  LockIcon,
  InfoIcon,
  PersonIcon,
  PersonLockIcon,
  EmailIcon,
} from "@shopify/polaris-icons";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6">
      <BlockStack gap="10">
        <Text variant="heading2xl" as="h1">
          Privacy Policy for Shopify Instagram Feed App
        </Text>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-blue-100 p-2 rounded-full">
                <Icon source={InfoIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Introduction
              </Text>
            </InlineStack>
            <Text>
              Welcome to <strong>Instagram Feed App</strong>. This Privacy
              Policy describes how we collect, use, and safeguard your
              information when you use our Shopify app that integrates Instagram
              feeds into your Shopify store.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-purple-100 p-2 rounded-full">
                <Icon source={PersonIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Information We Collect
              </Text>
            </InlineStack>

            <Text variant="headingMd" as="h3">
              1. Personal Information
            </Text>
            <List type="bullet">
              <List.Item>Shopify Store Owner Name</List.Item>
              <List.Item>Email Address</List.Item>
              <List.Item>Shopify Store URL</List.Item>
              <List.Item>
                Instagram Account Information (if connected)
              </List.Item>
            </List>

            <Text variant="headingMd" as="h3">
              2. Non-Personal Information
            </Text>
            <List type="bullet">
              <List.Item>Store Preferences</List.Item>
              <List.Item>App Usage Data</List.Item>
              <List.Item>
                Device Information (IP Address, Browser Type, Operating System)
              </List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-green-100 p-2 rounded-full">
                <Icon source={InfoIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                How We Use Your Information
              </Text>
            </InlineStack>
            <List type="bullet">
              <List.Item>
                Authenticate your Shopify and Instagram accounts
              </List.Item>
              <List.Item>
                Embed and manage Instagram feeds on your Shopify store
              </List.Item>
              <List.Item>
                Improve app functionality and user experience
              </List.Item>
              <List.Item>
                Provide customer support and send important updates
              </List.Item>
              <List.Item>Analyze app performance and usage trends</List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-red-100 p-2 rounded-full">
                <Icon source={LockIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Data Retention & Deletion
              </Text>
            </InlineStack>
            <Text>
              We retain your data as long as necessary to provide our services.
              If you wish to delete your data:
            </Text>
            <List type="bullet">
              <List.Item>
                Uninstall the app from your Shopify store to remove access to
                your data.
              </List.Item>
              <List.Item>
                Request data deletion via email:{" "}
                <strong>info@sprinix.com</strong>
              </List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Icon source={PersonLockIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Security Measures
              </Text>
            </InlineStack>
            <List type="bullet">
              <List.Item>
                Secure API authentication with Shopify and Instagram
              </List.Item>
              <List.Item>SSL encryption for data transmission</List.Item>
              <List.Item>Access control to limit data exposure</List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-teal-100 p-2 rounded-full">
                <Icon source={EmailIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Contact Us
              </Text>
            </InlineStack>
            <Text>If you have any questions, contact us at:</Text>
            <Text>
              📧 <strong>info@sprinix.com</strong>
              <br />
              🌐 <strong>https://sprinix.com</strong>
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </div>
  );
}
