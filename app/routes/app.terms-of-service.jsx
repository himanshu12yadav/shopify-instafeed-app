import { authenticate } from "../shopify.server";
import { Card, Text, BlockStack, InlineStack, Icon } from "@shopify/polaris";
import {
  StoreIcon,
  PersonIcon,
  CreditCardIcon,
  AlertCircleIcon,
  ExitIcon,
  RefreshIcon,
  EmailIcon,
  LockIcon,
  ContractIcon,
} from "@shopify/polaris-icons";
import { Link } from "@remix-run/react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto p-6">
      <BlockStack gap="5">
        <Text variant="heading2xl" as="h1">
          Terms of Service
        </Text>

        <Text as={"p"}>Last Updated: {new Date().toISOString().trim()}.</Text>

        <Card>
          <BlockStack gap="10">
            <InlineStack gap="3" align="left">
              <div className="bg-blue-100 p-2 rounded-full">
                <Icon source={ContractIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                1. Acceptance of Terms
              </Text>
            </InlineStack>
            <Text>
              By installing and using the <strong>Instagram Feed App</strong>,
              you agree to these Terms of Service. If you do not agree, please
              uninstall the app immediately.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-purple-100 p-2 rounded-full">
                <Icon source={StoreIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                2. Description of Service
              </Text>
            </InlineStack>
            <Text>
              This app allows you to integrate and display Instagram feeds on
              your Shopify store, enhancing your store's social media presence.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-green-100 p-2 rounded-full">
                <Icon source={PersonIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                3. User Responsibilities
              </Text>
            </InlineStack>
            <Text>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You must have a valid Shopify store and Instagram account.
                </li>
                <li>
                  You are responsible for ensuring your Instagram content
                  complies with <strong>Meta's</strong> and{" "}
                  <strong>Shopify's</strong> policies.
                </li>
                <li>
                  Any misuse, such as displaying unauthorized content, may
                  result in service termination.
                </li>
              </ul>
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-teal-100 p-2 rounded-full">
                <Icon source={LockIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                4. Data Collection & Privacy
              </Text>
            </InlineStack>
            <Text>
              Our app collects data such as your Shopify store details and
              Instagram authentication tokens. Learn more in our{" "}
              <Link
                to="/app/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy page
              </Link>
              .
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Icon source={CreditCardIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                5. Subscription & Payments
              </Text>
            </InlineStack>
            <Text>
              If applicable, any fees related to the app will be charged via
              Shopify's billing system. Refunds are subject to Shopify's
              policies.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-red-100 p-2 rounded-full">
                <Icon source={AlertCircleIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                6. Limitation of Liability
              </Text>
            </InlineStack>
            <Text>
              We are not responsible for any issues arising from changes to
              Instagram's API, Shopify's policies, or disruptions in the
              service.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-orange-100 p-2 rounded-full">
                <Icon source={ExitIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                7. Termination
              </Text>
            </InlineStack>
            <Text>
              We reserve the right to suspend or terminate your access if we
              detect a violation of these terms.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Icon source={RefreshIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                8. Changes to Terms
              </Text>
            </InlineStack>
            <Text>
              We may update these terms at any time, and continued use of the
              app signifies your acceptance of the latest version.
            </Text>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-pink-100 p-2 rounded-full">
                <Icon source={EmailIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                9. Contact Information
              </Text>
            </InlineStack>
            <Text>
              If you have any questions, contact us at:
              <br />
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
