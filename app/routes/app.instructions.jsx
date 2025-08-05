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
  ViewIcon,
  ConnectIcon,
  ImageIcon,
  CheckboxIcon,
  LayoutBlockIcon,
} from "@shopify/polaris-icons";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Instructions() {
  return (
    <div className="container mx-auto p-6">
      <BlockStack gap="20">
        <Text variant="heading2xl" as="h1">
          How to Use Instagram Feed App
        </Text>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-purple-100 p-2 rounded-full">
                <Icon source={ConnectIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Step 1: Connect Your Instagram Account
              </Text>
            </InlineStack>
            <Text>
              Connect your Instagram account to our app to access your posts.
              This allows us to fetch your content securely.
            </Text>
            <List type="bullet">
              <List.Item>
                Click on the "Connect Instagram" button in the dashboard
              </List.Item>
              <List.Item>
                Log in to your Instagram account when prompted
              </List.Item>
              <List.Item>
                Authorize the app to access your Instagram content
              </List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-blue-100 p-2 rounded-full">
                <Icon source={ImageIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Step 2: View Your Instagram Posts
              </Text>
            </InlineStack>
            <Text>
              Once connected, the app will automatically fetch all your
              Instagram posts. You'll see a gallery of your content ready to be
              selected.
            </Text>
            <List type="bullet">
              <List.Item>Your posts will appear in a grid layout</List.Item>
              <List.Item>
                Preview images, captions, and engagement metrics
              </List.Item>
              <List.Item>
                Posts are automatically updated when you add new content to
                Instagram
              </List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-green-100 p-2 rounded-full">
                <Icon source={CheckboxIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Step 3: Select Posts to Display
              </Text>
            </InlineStack>
            <Text>
              Choose which Instagram posts you want to showcase on your Shopify
              store. Simply check the boxes next to the posts you want to
              display.
            </Text>
            <List type="bullet">
              <List.Item>Use checkboxes to select individual posts</List.Item>
              <List.Item>Filter posts by type, title</List.Item>
              <List.Item>
                Rearrange the order of selected posts by drag-and-drop
              </List.Item>
              <List.Item>
                Click "Save Selection" to confirm your choices
              </List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <InlineStack gap="3" align="left">
              <div className="bg-orange-100 p-2 rounded-full">
                <Icon source={LayoutBlockIcon} color="primary" />
              </div>
              <Text variant="headingLg" as="h2">
                Step 4: Display on Your Storefront
              </Text>
            </InlineStack>
            <Text>
              Add the Instagram feed to your Shopify store using our custom
              block. You can place it on any page where you want to showcase
              your Instagram content.
            </Text>
            <List type="bullet">
              <List.Item>Go to your Shopify theme editor</List.Item>
              <List.Item>
                Select the page where you want to display your Instagram feed
              </List.Item>
              <List.Item>
                Add the "Instagram Feed" block to your desired section
              </List.Item>
              <List.Item>
                Customize the appearance (grid layout, captions, etc.)
              </List.Item>
              <List.Item>Save changes to publish your Instagram feed</List.Item>
            </List>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="4">
            <Text variant="headingMd" as="h3">
              Need Help?
            </Text>
            <Text>
              If you encounter any issues or have questions about using the
              Instagram Feed App, please contact our support team at
              support@instagramfeedapp.com or visit our help center.
            </Text>
          </BlockStack>
        </Card>
      </BlockStack>
    </div>
  );
}
