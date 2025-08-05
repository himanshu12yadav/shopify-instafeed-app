import {
  Button,
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Badge,
  Box,
  Icon,
  Toast,
  Frame,
  DataTable,
  Modal,
  ButtonGroup,
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useCallback, useState, useEffect } from "react";
import {
  useActionData,
  useLoaderData,
  useSubmit,
  useNavigate,
} from "@remix-run/react";

import { authenticate } from "../shopify.server.js";
import { getAllInstagramAccounts, deleteInstagramAccount, getAccountDeletionDetails } from "../db.server.js";
import { DeleteIcon, ViewIcon } from "@shopify/polaris-icons";

// Loader function to fetch all accounts
export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  
  try {
    const accounts = await getAllInstagramAccounts();
    
    return json({
      accounts: accounts || [],
      success: true,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return json({
      accounts: [],
      success: false,
      error: "Failed to fetch accounts",
    });
  }
};

// Action function to handle account deletion and details requests
export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const accountId = url.searchParams.get("accountId");
  const action = url.searchParams.get("action");
  
  // Handle deletion details request
  if (action === "getDeletionDetails" && accountId) {
    try {
      const details = await getAccountDeletionDetails(accountId);
      return json({
        success: true,
        details,
      });
    } catch (error) {
      console.error("Error fetching deletion details:", error);
      return json({
        success: false,
        message: "Failed to fetch deletion details",
      });
    }
  }
  
  // Handle form-based actions
  const formData = await request.formData();
  const formAction = formData.get("action");
  const formAccountId = formData.get("accountId");
  
  if (formAction === "delete" && formAccountId) {
    try {
      await deleteInstagramAccount(formAccountId);
      
      return json({
        success: true,
        message: "Account and all related data deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      return json({
        success: false,
        message: "Failed to delete account",
      });
    }
  }
  
  return json({ success: false, message: "Invalid action" });
};

export default function AccountsPage() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigate = useNavigate();
  
  const [deleteModal, setDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deletionDetails, setDeletionDetails] = useState(null);
  const [toaster, setToaster] = useState("");

  const { accounts } = loaderData;

  // Handle toast messages
  useEffect(() => {
    if (actionData?.message) {
      setToaster(actionData.message);
    }
  }, [actionData]);

  const toastActive = useCallback(() => {
    setToaster("");
  }, []);

  const handleDeleteClick = async (account) => {
    setAccountToDelete(account);
    
    // Fetch detailed deletion information
    try {
      const response = await fetch(`/app/accounts?accountId=${account.id}&action=getDeletionDetails`);
      const data = await response.json();
      if (data.success) {
        setDeletionDetails(data.details);
      }
    } catch (error) {
      console.error("Error fetching deletion details:", error);
    }
    
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (accountToDelete) {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("accountId", accountToDelete.id.toString());
      
      submit(formData, { method: "POST" });
      
      setDeleteModal(false);
      setAccountToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
    setAccountToDelete(null);
    setDeletionDetails(null);
  };

  // Prepare data for the DataTable
  const rows = accounts.map((account) => [
    <div key={`avatar-${account.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          background: 'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        @
      </div>
      <div>
        <Text as="p" variant="bodyMd" fontWeight="semibold">
          @{account.instagramUsername}
        </Text>
        <Text as="p" variant="bodySm" color="subdued">
          ID: {account.instagramId}
        </Text>
      </div>
    </div>,
    <Badge tone={account.accountType === "BUSINESS" ? "success" : "info"} size="small">
      {account.accountType || "Personal"}
    </Badge>,
    <Text as="p" variant="bodyMd" fontWeight="medium">
      {account.posts?.length || 0} posts
    </Text>,
    <Text as="p" variant="bodySm" color="subdued">
      {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : "N/A"}
    </Text>,
    <ButtonGroup>
      <Button
        size="micro"
        variant="plain"
        icon={ViewIcon}
        onClick={() => navigate("/app")}
      >
        View Posts
      </Button>
      <Button
        size="micro"
        variant="plain"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => handleDeleteClick(account)}
      >
        Delete
      </Button>
    </ButtonGroup>,
  ]);

  return (
    <Frame>
      <Page
        title="Connected Instagram Accounts"
        subtitle="Manage your connected Instagram business accounts"
        backAction={{
          content: "Back to Posts",
          onAction: () => navigate("/app"),
        }}
      >
        {toaster && (
          <Toast
            content={toaster}
            onDismiss={toastActive}
            duration={3000}
          />
        )}

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500" padding="500">
                <InlineStack align="space-between">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Instagram Accounts ({accounts.length})
                    </Text>
                    <Text as="p" variant="bodyMd" color="subdued">
                      View and manage all your connected Instagram business accounts.
                    </Text>
                  </BlockStack>
                  <Button
                    primary
                    onClick={() => navigate("/app")}
                  >
                    Connect New Account
                  </Button>
                </InlineStack>

                {accounts.length > 0 ? (
                  <DataTable
                    columnContentTypes={[
                      "text",
                      "text", 
                      "numeric",
                      "text",
                      "text",
                    ]}
                    headings={[
                      "Account",
                      "Type",
                      "Posts",
                      "Connected",
                      "Actions",
                    ]}
                    rows={rows}
                  />
                ) : (
                  <BlockStack gap="400" alignment="center" padding="600">
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '40px',
                        background: 'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '32px',
                      }}
                    >
                      @
                    </div>
                    <BlockStack gap="200" alignment="center">
                      <Text as="h3" variant="headingMd">
                        No Instagram Accounts Connected
                      </Text>
                      <Text as="p" variant="bodyMd" color="subdued">
                        Connect your Instagram business account to start displaying your posts.
                      </Text>
                    </BlockStack>
                    <Button
                      primary
                      size="large"
                      onClick={() => navigate("/app")}
                    >
                      Connect Instagram Account
                    </Button>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Account Statistics */}
          {accounts.length > 0 && (
            <Layout.Section secondary>
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="300" padding="400">
                    <Text as="h3" variant="headingMd">
                      Overview
                    </Text>
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodyMd">
                          Total Accounts:
                        </Text>
                        <Badge tone="info">
                          {accounts.length}
                        </Badge>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodyMd">
                          Total Posts:
                        </Text>
                        <Badge tone="success">
                          {accounts.reduce((sum, account) => sum + (account.posts?.length || 0), 0)}
                        </Badge>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodyMd">
                          Business Accounts:
                        </Text>
                        <Badge tone="attention">
                          {accounts.filter(account => account.accountType === "BUSINESS").length}
                        </Badge>
                      </InlineStack>
                    </BlockStack>
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          )}
        </Layout>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModal}
          onClose={handleDeleteCancel}
          title="Delete Instagram Account"
          primaryAction={{
            content: "Delete Account",
            onAction: handleDeleteConfirm,
            destructive: true,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleDeleteCancel,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <Text as="p" variant="bodyMd">
                Are you sure you want to delete the Instagram account{" "}
                <Text as="span" fontWeight="semibold">
                  @{accountToDelete?.instagramUsername}
                </Text>
                ?
              </Text>
              <Text as="p" variant="bodyMd" color="critical">
                This action will permanently delete:
              </Text>
              <ul style={{ paddingLeft: '20px' }}>
                <li>
                  <Text as="p" variant="bodyMd">
                    The Instagram account connection
                  </Text>
                </li>
                <li>
                  <Text as="p" variant="bodyMd">
                    All {deletionDetails?.postsCount || accountToDelete?.posts?.length || 0} associated Instagram posts
                  </Text>
                </li>
                {deletionDetails?.selectedPostsCount > 0 && (
                  <li>
                    <Text as="p" variant="bodyMd">
                      {deletionDetails.selectedPostsCount} selected posts that are currently displayed on your storefront
                    </Text>
                  </li>
                )}
                {deletionDetails?.productLinksCount > 0 && (
                  <li>
                    <Text as="p" variant="bodyMd">
                      {deletionDetails.productLinksCount} product links associated with these posts
                    </Text>
                  </li>
                )}
                {(!deletionDetails?.productLinksCount || deletionDetails.productLinksCount === 0) && (
                  <li>
                    <Text as="p" variant="bodyMd">
                      All product links associated with these posts (if any)
                    </Text>
                  </li>
                )}
              </ul>
              <Text as="p" variant="bodyMd" color="critical" fontWeight="semibold">
                This action cannot be undone.
              </Text>
            </BlockStack>
          </Modal.Section>
        </Modal>
      </Page>
    </Frame>
  );
}