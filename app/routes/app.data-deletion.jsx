import { authenticate } from "../shopify.server.js";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Icon,
  Link,
} from "@shopify/polaris";
import {
  DeleteIcon,
  EmailIcon,
  InfoIcon,
  LockIcon,
} from "@shopify/polaris-icons";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function AppDataDeletion() {
  return (
    <div className="container mx-auto p-6">
      <BlockStack gap="20">
        <Text variant="heading2xl" as="h1">
          Data Deletion Policy
        </Text>

        <Card>
          <BlockStack gap="20">
            <InlineStack gap="20" align="left">
              <div className="bg-red-100 p-2 rounded-full">
                <Icon source={InfoIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Overview
              </Text>
            </InlineStack>
            <Text>
              At Instagram Feed App, we respect your privacy and your right to
              control your data. This page explains how you can request deletion
              of your data from our systems.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-purple-100 p-2 rounded-full">
                <Icon source={DeleteIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Data Deletion Process
              </Text>
            </InlineStack>
            <Text>
              If you wish to delete your data from our app, please follow these
              steps:
            </Text>
            <Text>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Uninstall the app from your Shopify store</li>
                <li>
                  Contact us via email to confirm your data deletion request
                </li>
                <li>
                  Receive confirmation once your data has been permanently
                  deleted
                </li>
              </ol>
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-blue-100 p-2 rounded-full">
                <Icon source={LockIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                What Data Will Be Deleted
              </Text>
            </InlineStack>
            <Text>
              Upon your request, we will delete all of your data including:
            </Text>
            <Text>
              <ul className="list-disc pl-6 space-y-2">
                <li>Instagram account connection information</li>
                <li>Instagram feed configuration settings</li>
                <li>Any cached Instagram posts or media</li>
                <li>User preferences and settings</li>
                <li>Any analytics data associated with your account</li>
              </ul>
            </Text>
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
            <Text>To request deletion of your data, please contact us at:</Text>
            <Text>
              📧{" "}
              <Link url="mailto:info@sprinix.com" external>
                info@sprinix.com
              </Link>
            </Text>
            <Text>
              We will promptly process your request and delete your data from
              our systems. You will receive confirmation once the deletion
              process is complete.
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </div>
  );
}
