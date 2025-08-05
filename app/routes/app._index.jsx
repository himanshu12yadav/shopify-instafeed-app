import {
  Button,
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Grid,
  FooterHelp,
  Pagination,
  MediaCard,
  VideoThumbnail,
  Checkbox,
  InlineStack,
  Badge,
  Box, Icon,
  Toast,
  Frame, List,
    ActionList,
    Popover,
  TextField
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@shopify/app-bridge-react";

import ModalGridComponent from "../components/ModalGridComponent.jsx";
import { SelectComponent } from "../components/SelectComponent.jsx";
import { SkeletonCard } from "../components/SkeletonCard.jsx";
import { AutoComplete } from "../components/AutoComplete.jsx";

import {AlertCircleIcon, DeleteIcon, RefreshIcon, SettingsIcon, PlayIcon} from "@shopify/polaris-icons";
import debounce from "lodash/debounce";

import {
  isRouteErrorResponse,
  Link,
  useActionData,
  useLoaderData, useNavigate, useRouteError,
  useSubmit,
  useRevalidator,
} from "@remix-run/react";

import axios from "axios";
import {
  getAllInstagramPostbyAccountId,
  updatePostData,
} from "../db.server.js";

import { ClientOnly } from "../hooks/useHydrated.jsx";
import { getSubscriptionStatus, searchProducts } from "./graphql/query.jsx";
import { authenticate } from "../shopify.server.js";



// loader function
export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop.split(".")[0];
  const state = btoa(JSON.stringify({ shop }));

  const BYPASS_SUBSCRIPTION = process.env.BYPASS_SUBSCRIPTION === "true" || false;

  const {
    data: {
      currentAppInstallation: { activeSubscriptions },
    },
  } = await getSubscriptionStatus(admin);

  const subscription = activeSubscriptions[0];

  if (BYPASS_SUBSCRIPTION) {
    console.log("Subscription status: ", process.env.BYPASS_SUBSCRIPTION);
    const { getAllInstagramAccounts } = await import("../db.server.js");
    const accounts = await getAllInstagramAccounts();

    return json({
      accounts,
      hasActiveSubscription: true,
      shop,
      bypassEnabled: true,
      state
    });
  }

  if (!activeSubscriptions || activeSubscriptions.length <=0){
    return json({
      hasActiveSubscription: false,
      shop
    })
  }

  const isPaidSubscriber =  subscription?.status === "ACTIVE";

  if (isPaidSubscriber) {
    const { getAllInstagramAccounts } = await import("../db.server.js");

    const accounts = await getAllInstagramAccounts();
    console.log("ACcount: loader: ", accounts);

    return json({
      accounts,
      hasActiveSubscription: isPaidSubscriber,
    });
  }

  // Trial check only if it hasn't paid subscriber

  const currentDate = new Date();
  const creationDate = new Date(subscription?.createdAt);
  const trialDays = subscription?.trialDays || 0;

  const trialEndDate = trialDays > 0 ? new Date(creationDate) : null;

  // only add days if we have a valid trial end date

  if (trialEndDate) {
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);
  }

  const isTrialExpired = !trialEndDate || currentDate > trialEndDate;

  if (!isTrialExpired){
    return json({
      hasActiveSubscription: isTrialExpired,
      shop
    })
  }

  return json({
    hasActiveSubscription: false,
    shop
  })

};

async function getAllPosts(url) {
  let allPosts = [];

  while (url) {
    const { data } = await axios.get(url);
    allPosts = [...allPosts, ...data.data];
    url = data.paging?.next || null;
  }

  return allPosts;
}

// action function
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const {
    findUserByInstagramUsername,
    storeInstagramPosts,
    findPostById,
    deleteAllPostByAccountId,
    getFilteredInstagramPosts,
  } = await import("../db.server.js");

  // getting selected account
  const selectedAccount = formData.get("selectedAccount") ? JSON.parse(formData.get("selectedAccount")) : null;

  // getting checked post
  const checkedPost = formData.get("checkedPost") ? JSON.parse(formData.get("checkedPost")) : null;

  // refresh the posts
  const refreshInstagramPosts = formData.get("refreshInstagramPosts") ? JSON.parse(formData.get("refreshInstagramPosts")) : null;

  // search query
  const searchQuery = formData.get("searchQuery") ? JSON.parse(formData.get("searchQuery")) : null;

  // product search query
  const productSearchQuery = formData.get("productSearchQuery");

  const message = {success: [], error: []};

  if (searchQuery) {
    const search = searchQuery?.searchTerm[0];
    const filterValue = searchQuery?.filterValue;
    const username =
      Object.keys(searchQuery?.selected).length > 0
        ? searchQuery?.selected
        : null;

    if (username && (search || filterValue !== "all")) {
      console.log("search Query: ", searchQuery);

      const filterResult = await getFilteredInstagramPosts(
        search,
        filterValue,
        username,
      );

      const captionLists = filterResult
        .map((post) => ({
          label: post.caption == null ? "No caption" : post.caption,
          value: post.caption,
        }))
        .filter((item) => item.value !== null);

      return { data: filterResult, captionLists };
    } else if (username && (search || filterValue === "all")) {
      const filterResult = await getFilteredInstagramPosts(
        search,
        filterValue,
        username,
      );

      const captionLists = filterResult
        .map((post) => ({
          label: post.caption == null ? "No caption" : post.caption,
          value: post.caption,
        }))
        .filter((item) => item.value !== "No caption");

      return { data: filterResult, captionLists };
    }
  }

  // refresh Instagram post
  if (refreshInstagramPosts) {
    const { refresh, selectedAccount } = refreshInstagramPosts;

    const { instagramToken: accessToken, id } =
      await findUserByInstagramUsername(selectedAccount);

    if (refresh) {
      await deleteAllPostByAccountId(id);

      let url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${accessToken}`;

      const currentPosts = await getAllPosts(url);

      await storeInstagramPosts(currentPosts, id);

      const captionLists = currentPosts
        .map((post) => ({
          label: post.caption == null ? "No caption" : post.caption,
          value: post.caption,
        }))
        .filter((item) => item.value !== null);

      message['success'].push({
        success: 'Instagram posts updated successfully',
      });

      return {
        data: await getAllInstagramPostbyAccountId(id),
        captionLists,
        message,
      };
    }
  }

  // posted checked for show on website
  if (checkedPost && Object.keys(checkedPost).length > 0) {
    const postId = checkedPost.id;
    const selectionStatus = checkedPost.checked;
    const currentPost = await findPostById(postId);

    if (postId && currentPost.id) {
      const { account } = currentPost;
      await updatePostData(currentPost.id, "selected", selectionStatus);
      const posts = await getAllInstagramPostbyAccountId(account);

      const captionLists = posts
        .map((post) => ({
          label: post.caption == null ? "No caption" : post.caption,
          value: post.caption,
        }))
        .filter((item) => item.value !== null);

      message['success'].push({
        success: 'Post selected update successfully',
      })

      return {
        data: await getAllInstagramPostbyAccountId(account),
        captionLists,
        message
      };
    }

    return null;
  }

  // query for selectedAccount
  if (selectedAccount && Object.keys(selectedAccount).length > 0) {
    const dbUsername = await findUserByInstagramUsername(
      selectedAccount?.account,
    );
    const accessToken = dbUsername?.instagramToken;

    if (!dbUsername) return null;

    if (dbUsername.posts.length > 0) {
      const posts = await getAllInstagramPostbyAccountId(dbUsername.id);

      const captionLists = posts
        .map((post) => ({
          label: post.caption == null ? "No caption" : post.caption,
          value: post.caption,
        }))
        .filter((item) => item.value !== null);

      message['success'].push({
        success: 'Instagram posts loaded successfully',
      })

      return {
        data: posts,
        captionLists,
        message
      };
    }

    let url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${accessToken}`;

    const posts = await getAllPosts(url);

    // save data in database
    await storeInstagramPosts(posts, dbUsername.id);
    return { data: await getAllInstagramPostbyAccountId(dbUsername.id) };
  }

  // Handle product search
  if (productSearchQuery) {
    try {
      const result = await searchProducts(admin, productSearchQuery, 10);
      return { productSearchResults: result.products };
    } catch (error) {
      console.error('Product search error:', error);
      message.error.push({ error: 'Failed to search products' });
      return { productSearchResults: [], message };
    }
  }

  return null;
};



export default function Index() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [open, setIsOpen] = useState(false);
  const [selectPost, setSelectPost] = useState({ id: "", checked: false });

  const {hasActiveSubscription, shop, state} = loaderData;

  const navigate = useNavigate();

  const [selected, setSelected] = useState("");
  const [userData, setUserData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalSelectedPost, setTotalSelectedPost] = useState(0);

  // search filter states
  const [captionList, setCaptionList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  const [toaster, setToaster] = useState('')
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [productModal, setProductModal] = useState(false);

  // ADD THESE NEW STATE VARIABLES FOR PRODUCT MODAL
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [productResults, setProductResults] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [existingProducts, setExistingProducts] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  const toastActive = useCallback(()=> {
    setToaster('')
  }, [toaster])

  // Check if this is first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('instafeed_welcome_shown');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    localStorage.setItem('instafeed_welcome_shown', 'true');
    setShowWelcomeModal(false);
  };

  const options = [
    { label: "All", value: "all" },
    { label: "Image", value: "IMAGE" },
    { label: "Video", value: "VIDEO" },
  ];

  const { accounts } = loaderData;

  console.log("Accounts: ",accounts);

  useEffect(() => {
    if (!actionData) return;

    if (actionData.message?.success?.length > 0) {
      setToaster(actionData.message.success[0].success);
    } else if (actionData.message?.error?.length > 0) {
      setToaster(actionData.message.error[0].error);
    }

  }, [actionData]);

  const instagramUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=624455150004028&redirect_uri=https://instagramfeed-app.sprinix.com/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights&state=${state}`;

  const submit = useSubmit();
  const revalidator = useRevalidator();

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const payload = {
          selected,
          searchTerm: value || "",
          filterValue,
        };
        submit({ searchQuery: JSON.stringify(payload) }, { method: "POST" });
      }, 1000),
    [selected, filterValue],
  );

  // useEffect start here

  useEffect(() => {
    if (selected && selected.length > 0) {
      debouncedSearch.cancel();

      const payload = {
        selected,
        searchTerm: searchTerm || "",
        filterValue,
      };

      submit({ searchQuery: JSON.stringify(payload) }, { method: "POST" });
    }
  }, [filterValue, selected]);

  useEffect(() => {
    // only search if we have a selected account
    if (!selected || selected.length === 0) {
      return;
    }

    // if the search term is empty and filter is "all" no need for special filtering.
    if (!searchTerm && filterValue === "all") {
      return;
    }

    // Cancel any pending debounced searches
    debouncedSearch.cancel();

    // create the payload
    const payload = {
      selected,
      searchTerm: searchTerm || "",
      filterValue,
    };

    //submit the search
    submit({ searchQuery: JSON.stringify(payload) }, { method: "POST" });
  }, [searchTerm, filterValue, selected, debouncedSearch]);

  // update the handle search function
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value || value === "") {
      debouncedSearch.cancel();

      if (selected && selected.length > 0) {
        const payload = {
          selected,
          searchTerm: "",
          filterValue: "all",
        };
        submit({ searchQuery: JSON.stringify(payload) }, { method: "POST" });
      }
      return;
    }

    if (value.length >= 2) {
      // Only search with 2+ characters
      debouncedSearch(value);
    }
  };

  useEffect(() => {
    // Only update userData and captionList if they exist in actionData
    // This prevents clearing them during product searches
    if (actionData?.data !== undefined) {
      setUserData(actionData.data);
    }
    if (actionData?.captionLists !== undefined) {
      setCaptionList(actionData.captionLists);
    }

    // Handle product search results (only when modal is open)
    if (actionData?.productSearchResults && productModal) {
      setProductResults(actionData.productSearchResults);
      setIsProductLoading(false);
    }

    // Fetch product counts when userData is loaded
    if (actionData?.data && actionData.data.length > 0) {
      // Try to get accountId from the first post, or use the selected account
      const firstPost = actionData.data[0];
      console.log("First post structure:", firstPost);

      let accountIdToUse = null;

      // If posts have account field, use that
      if (firstPost.account) {
        accountIdToUse = firstPost.account;
      } else if (selected && selected.length > 0) {
        // Find the account ID from the selected account (selected is a username string)
        console.log("Looking for account with username:", selected);
        console.log("Available accounts:", accounts);
        const foundAccount = accounts?.find(account => account.instagramUsername === selected);
        console.log("Found account:", foundAccount);
        if (foundAccount) {
          accountIdToUse = foundAccount.id;
        }
      }

      if (accountIdToUse) {
        console.log("Using accountId:", accountIdToUse);
        fetchProductCounts(accountIdToUse);
      } else {
        console.log("No account ID found");
      }
    }

  }, [actionData, selected, accounts, productModal]);

  useEffect(() => {
    setIsLoading(false);
  }, [userData]);

  useEffect(() => {
    setIsLoading(true);
    if (!selected) {
      setCaptionList([]);
    }
    const payload = {
      account: selected,
    };

    submit({ selectedAccount: JSON.stringify(payload) }, { method: "POST" });
  }, [selected]);

  useEffect(() => {
    console.log("selectPost: ", selectPost);
    submit({ checkedPost: JSON.stringify(selectPost) }, { method: "POST" });
  }, [selectPost]);

  useEffect(() => {
    let count = 0;

    if (userData) {
      let totalCount = userData.filter((item) => item.selected).length;
      count = totalCount;
    }

    setTotalSelectedPost(count);
  }, [userData]);

  const handleConnect = () => {
    window.top.location.href = instagramUrl;
  };

  const handleAccountSelect = useCallback((value) => {
    setSelected(value);
  }, []);

  const [activePopover, setActivePopover] = useState(null);

  const togglePopover = useCallback((postId)=>{
    setActivePopover(activePopover === postId ? null : postId);
  }, [activePopover]);

  const handleModalOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleModalClose = useCallback(() => setIsOpen((prev) => !prev), []);

// ADD THESE NEW CALLBACK FUNCTIONS
  const handleProductModalClose = useCallback(() => {
    setProductModal(false);
    setSelectedProduct(null);
    setProductSearchQuery('');
    setProductResults([]);
    setIsProductLoading(false);
    setExistingProducts([]);
    setSelectedPostId(null);
  }, []);

  // Clear product search results when modal closes
  useEffect(() => {
    if (!productModal) {
      setProductResults([]);
      setProductSearchQuery('');
      setSelectedProduct(null);
      setIsProductLoading(false);
      setExistingProducts([]);
      setSelectedPostId(null);
    }
  }, [productModal]);

  const handleProductSearch = useCallback((query) => {
    if (!query || query.length < 2) {
      setProductResults([]);
      return;
    }

    setIsProductLoading(true);

    // Use Remix's submit to handle the form submission properly
    const payload = { productSearchQuery: query };
    submit(payload, { method: "POST" });
  }, []);

  // Debounced product search
  const debouncedProductSearch = useMemo(
      () => debounce((query) => handleProductSearch(query), 300),
      [handleProductSearch]
  );


  // Handle product search input change
  const handleProductSearchChange = (value) => {
    setProductSearchQuery(value);
    debouncedProductSearch(value);
  };

  // Clear product search
  const handleClearProductSearch = () => {
    setProductSearchQuery('');
    setProductResults([]);
    setSelectedProduct(null);
  };


  const linkProductToPost = async (postId, productData) => {
    try {
      const formData = new FormData();
      formData.append("action", "add");
      formData.append("postId", postId);
      formData.append("productData", JSON.stringify(productData));

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setToaster("Product linked successfully!");
        // Refresh the posts data
        revalidator.revalidate();
        return { success: true };
      } else {
        if (result.error === "duplicate") {
          setToaster("This product is already linked to this post!");
          return { success: false, isDuplicate: true };
        } else {
          setToaster("Failed to link product");
          return { success: false, isDuplicate: false };
        }
      }
    } catch (error) {
      console.error("Error linking product:", error);
      setToaster("Error linking product");
      return { success: false, isDuplicate: false };
    }
  };

  const fetchExistingProducts = async (postId) => {
    try {
      console.log("Fetching existing products for postId:", postId);

      // Try GET request first (simpler for debugging)
      let response = await fetch(`/api/products?action=get&postId=${postId}`);
      let data = await response.json();

      // If GET fails, try POST with FormData
      if (!data.success) {
        console.log("GET request failed, trying POST");
        const formData = new FormData();
        formData.append('action', 'get');
        formData.append('postId', postId);

        response = await fetch('/api/products', {
          method: 'POST',
          body: formData,
        });

        data = await response.json();
      }

      console.log("API response:", data);
      if (data.success) {
        console.log("Setting existing products:", data.data);
        setExistingProducts(data.data || []);
      } else {
        console.log("Failed to fetch products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching existing products:", error);
    }
  };

  const handleRemoveProduct = async (postId, productId) => {
    try {
      const formData = new FormData();
      formData.append('action', 'remove');
      formData.append('postId', postId);
      formData.append('productId', productId);

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Refresh existing products list
        fetchExistingProducts(postId);
        setToaster('Product removed successfully!');
        // Update product count
        updateProductCount(postId, -1);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      setToaster('Error removing product');
    }
  };

  const fetchProductCounts = async (accountId) => {
    try {
      console.log("Fetching product counts for accountId:", accountId);

      // Try GET request first (simpler for debugging)
      let response = await fetch(`/api/products?action=getCounts&accountId=${accountId}`);
      let data = await response.json();

      // If GET fails, try POST with FormData
      if (!data.success) {
        console.log("GET request failed, trying POST");
        const formData = new FormData();
        formData.append('action', 'getCounts');
        formData.append('accountId', accountId);

        response = await fetch('/api/products', {
          method: 'POST',
          body: formData,
        });

        data = await response.json();
      }

      console.log("Product counts API response:", data);
      if (data.success) {
        console.log("Setting product counts:", data.data);
        setProductCounts(data.data || {});
      } else {
        console.log("Failed to fetch product counts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching product counts:", error);
    }
  };

  const updateProductCount = (postId, change) => {
    setProductCounts(prev => ({
      ...prev,
      [postId]: Math.max(0, (prev[postId] || 0) + change)
    }));
  };

  const handleProductSelect = async (postId, product) => {
    const productData = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      image: product.image,
      price: product.price,
    };

    const result = await linkProductToPost(postId, productData);

    // Only close modal and update count if product was successfully added
    if (result.success) {
      setProductModal(false);
      setSelectedProduct(null);
      setProductSearchQuery('');
      setProductResults([]);
      // Refresh existing products after adding
      fetchExistingProducts(postId);
      // Update product count only if successfully added
      updateProductCount(postId, 1);
    } else if (result.isDuplicate) {
      // For duplicates, keep the modal open and just clear the selection
      setSelectedProduct(null);
      // Refresh existing products to show current state
      fetchExistingProducts(postId);
    } else {
      // For other errors, also keep modal open and clear selection
      setSelectedProduct(null);
    }
  };


  return hasActiveSubscription ? (
      <Frame>
        <Page
            title="Instagram Integration"
            subtitle="Connect and manage your Instagram business accounts"
            primaryAction={
              <Button primary onClick={handleModalOpen}>
                View Selected Posts <Badge>{totalSelectedPost}</Badge>
              </Button>
            }
            secondaryActions={[
              {
                content: "Manage Accounts",
                onAction: () => navigate("/app/accounts"),
              }
            ]}
        >
          {
              toaster ? (
                  <Toast content={toaster} onDismiss={toastActive}
                                duration={2000}/> ) : null
          }
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <BlockStack gap="500" padding="500">
                  <Text as={"h2"} variant={"headingMd"}>
                    Select Instagram Account
                  </Text>
                  <SelectComponent allOption={accounts} option={handleAccountSelect} value={selected} />
                  <div style={{ textAlign: "right" }}>
                    <Button primary onClick={handleConnect}>
                      Connect to Instagram
                    </Button>
                  </div>
                </BlockStack>
              </Card>
            </Layout.Section>

            <Layout.Section secondary>
              <Card>
                <BlockStack gap="500" padding="500">
                  <InlineStack align="space-between" gap="400">
                    <Text variant={"headingMd"} as={"h2"}>
                      Instagram Posts
                    </Text>
                    <InlineStack align={'space-between'} gap={'400'} blockAlign={'end'}>
                      <Button
                          primary
                          icon={RefreshIcon}
                          onClick={() => {
                            const payload = {
                              refresh: true,
                              selectedAccount: selected,
                            };

                            setIsLoading(true);

                            submit(
                                { refreshInstagramPosts: JSON.stringify(payload) },

                                { method: "POST" },
                            );
                          }}
                      >
                        Update Posts
                      </Button>
                    </InlineStack>


                  </InlineStack>
                  {selected && selected.length > 0 && (
                    <AutoComplete
                        captionList={captionList}
                        filterOptions={options}
                        setInputValue={handleSearch}
                        setFilterValue={setFilterValue}
                        selectedAccount={selected}
                        searchTerm={searchTerm}
                    />
                  )}
                  <Grid>
                    {isLoading &&
                        [...Array(10)].map((_, i) => <SkeletonCard key={i} />)}

                    {!isLoading &&
                        userData?.map((post) => (
                            <Grid.Cell
                                key={post.id}
                                columnSpan={{ xs: 6, sm: 4, md: 3, lg: 3 }}
                            >
                              <Card>
                                <div style={{ position: "relative" }}>
                                  <div
                                      style={{
                                        position: "absolute",
                                        top: "12px",
                                        left: "12px",
                                        zIndex: "10",
                                      }}
                                  >
                                    <Checkbox
                                        checked={post.selected}
                                        onChange={() =>
                                            setSelectPost({
                                              id: post.id,
                                              checked: !post.selected,
                                            })
                                        }
                                        id={post.id}
                                    />
                                  </div>

                                  <div
                                      style={{
                                        position: "absolute",
                                        top: "12px",
                                        right: "12px",
                                        zIndex: "10",
                                        background: "rgba(255, 255, 255, 0.9)",
                                        borderRadius: "4px",
                                        padding: "2px",
                                      }}
                                  >
                                    <Popover
                                        active={activePopover === post.id}
                                        activator={
                                          <Button
                                              icon={SettingsIcon}
                                              variant="plain"
                                              size="micro"
                                              onClick={() => togglePopover(post.id)}
                                          />
                                        }
                                        onClose={() => togglePopover(null)}
                                    >
                                      <ActionList
                                          items={[
                                            {
                                              content: 'View on Instagram',
                                              onAction: () => {
                                                window.open(post.permalink, "_blank");
                                                togglePopover(null);
                                              },
                                            },
                                            {
                                              content: post.selected ? 'Unselect Post' : 'Select Post',
                                              onAction: () => {
                                                setSelectPost({
                                                  id: post.id,
                                                  checked: !post.selected,
                                                });
                                                togglePopover(null);
                                              },
                                            },
                                            {
                                              content: 'Copy Link',
                                              onAction: () => {
                                                navigator.clipboard.writeText(post.permalink);
                                                togglePopover(null);
                                              },
                                            },
                                            {
                                              content: 'Add Product',
                                              onAction: () => {
                                                setSelectedPostId(post.id);
                                                fetchExistingProducts(post.id);
                                                setProductModal(true);
                                                togglePopover(null);
                                              },
                                            },
                                          ]}
                                      />
                                    </Popover>
                                  </div>

                                  <div
                                      style={{
                                        position: "relative",
                                        cursor: "pointer",
                                        overflow: "hidden",
                                        borderRadius: "8px 8px 0 0",
                                      }}
                                      onClick={() => window.open(post.permalink, "_blank")}
                                  >
                                    {post.mediaType === "VIDEO" ? (
                                        <div
                                            style={{
                                              position: "relative",
                                              width: "100%",
                                              height: "200px",
                                              overflow: "hidden",
                                            }}
                                        >
                                          <img
                                              src={post.thumbnailUrl}
                                              alt={post.caption || "Instagram video"}
                                              style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                                display: "block",
                                                transition: "transform 0.2s ease",
                                              }}
                                              onMouseEnter={(e) => {
                                                e.target.style.transform = "scale(1.05)";
                                              }}
                                              onMouseLeave={(e) => {
                                                e.target.style.transform = "scale(1)";
                                              }}
                                          />
                                          <div
                                              style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                background: "rgba(0, 0, 0, 0.6)",
                                                borderRadius: "50%",
                                                padding: "8px",
                                                color: "white",
                                                pointerEvents: "none",
                                              }}
                                          >
                                            <Icon source={PlayIcon} />
                                          </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={post.mediaUrl || post.thumbnailUrl}
                                            alt={post.caption || "Instagram post"}
                                            style={{
                                              width: "100%",
                                              height: "200px",
                                              objectFit: "cover",
                                              display: "block",
                                              transition: "transform 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                              e.target.style.transform = "scale(1.05)";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.target.style.transform = "scale(1)";
                                            }}
                                        />
                                    )}
                                  </div>
                                </div>

                                <Box padding="300">
                                  <BlockStack gap="200">
                                    <InlineStack align="space-between" blockAlign="start">
                                      <Text as="h3" variant="headingSm" fontWeight="medium">
                                        @{post.username}
                                      </Text>
                                      <Text as="p" variant="bodySm" color="subdued">
                                        {new Date(post.timestamp).toLocaleDateString()}
                                      </Text>
                                    </InlineStack>

                                    <Text as="p" variant="bodyMd" color="subdued">
                                      {post.caption
                                        ? post.caption.length > 80
                                          ? `${post.caption.substring(0, 80)}...`
                                          : post.caption
                                        : "No caption"
                                      }
                                    </Text>

                                    <InlineStack gap="100" align="start">
                                      <Badge
                                        tone={post.selected ? "success" : "info"}
                                        size="small"
                                      >
                                        {post.selected ? "Selected" : "Available"}
                                      </Badge>
                                      <Badge
                                        tone={post.mediaType === "VIDEO" ? "attention" : "info"}
                                        size="small"
                                      >
                                        {post.mediaType === "VIDEO" ? "Video" : "Image"}
                                      </Badge>
                                      {productCounts[post.id] > 0 && (
                                        <Badge
                                          tone="success"
                                          size="small"
                                        >
                                          🛍️ {productCounts[post.id]} Product{productCounts[post.id] !== 1 ? 's' : ''}
                                        </Badge>
                                      )}
                                    </InlineStack>
                                  </BlockStack>
                                </Box>
                              </Card>
                            </Grid.Cell>
                        ))}
                  </Grid>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination />
                  </div>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <FooterHelp>
                <BlockStack gap="400" alignment={"center"}>
                  <Text as={"p"} alignment={"center"}>
                    Learn more about {""}
                    <Link
                        to={
                          "https://help.shopify.com/manual/promoting-marketing/social-media/instagram"
                        }
                    >
                      Instagram integration
                    </Link>
                  </Text>
                  <Text variant={"bodySm"} as={"p"} color={"subdued"}>
                    © 2024 Your App Name. All rights reserved.
                  </Text>
                </BlockStack>
              </FooterHelp>
            </Layout.Section>
            <ClientOnly>
              <Modal open={open} onHide={handleModalClose} variant={"large"}>
                <Box padding={"500"}>
                  <ModalGridComponent posts={userData} productCounts={productCounts} />
                </Box>
              </Modal>

              {/* Product Modal  */}
              <Modal open={productModal} onHide={handleProductModalClose} variant={"large"}>
                <Box padding={"400"}>
                  <BlockStack gap="500">
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingLg">
                        Link Product to Instagram Post
                      </Text>
                      <Text as="p" variant="bodyMd" color="subdued">
                        Search and select a product from your store to link with this Instagram post.
                        This will help customers discover your products directly from your Instagram feed.
                      </Text>
                    </BlockStack>

                    {existingProducts.length > 0 && (
                      <Card>
                        <BlockStack gap="400" padding="400">
                          <Text as="h3" variant="headingMd">
                            Already Added Products ({existingProducts.length})
                          </Text>

                          <div style={{
                            maxHeight: '200px',
                            overflow: 'auto',
                            border: '1px solid #e1e1e1',
                            borderRadius: '8px'
                          }}>
                            {existingProducts.map((product) => (
                              <div
                                key={product.id}
                                style={{
                                  padding: '12px',
                                  borderBottom: '1px solid #f0f0f0',
                                  backgroundColor: '#f9f9f9'
                                }}
                              >
                                <InlineStack gap="300" align="space-between">
                                  <InlineStack gap="300">
                                    <div style={{
                                      width: '50px',
                                      height: '50px',
                                      backgroundColor: '#f0f0f0',
                                      borderRadius: '4px',
                                      overflow: 'hidden'
                                    }}>
                                      {product.productImage && (
                                        <img
                                          src={product.productImage}
                                          alt={product.productTitle}
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                          }}
                                        />
                                      )}
                                    </div>
                                    <BlockStack gap="100">
                                      <Text as="h4" variant="bodyMd" fontWeight="medium">
                                        {product.productTitle}
                                      </Text>
                                      <Text as="p" variant="bodySm" color="subdued">
                                        Handle: {product.productHandle}
                                      </Text>
                                      {product.productPrice && (
                                        <Text as="p" variant="bodySm" color="subdued">
                                          Price: {product.productPrice}
                                        </Text>
                                      )}
                                    </BlockStack>
                                  </InlineStack>

                                  <Button
                                    size="micro"
                                    variant="plain"
                                    tone="critical"
                                    onClick={() => handleRemoveProduct(selectedPostId, product.productId)}
                                  >
                                    Remove
                                  </Button>
                                </InlineStack>
                              </div>
                            ))}
                          </div>
                        </BlockStack>
                      </Card>
                    )}

                    <Card>
                      <BlockStack gap="400" padding="400">
                        <Text as="h3" variant="headingMd">
                          Search Products
                        </Text>

                        <BlockStack gap="300">
                          <TextField
                              label="Search products"
                              value={productSearchQuery}
                              onChange={handleProductSearchChange}
                              placeholder="Search by title, handle, or SKU..."
                              autoComplete="off"
                              clearButton
                              onClearButtonClick={handleClearProductSearch}
                          />

                          {isProductLoading && (
                              <div style={{ padding: '20px', textAlign: 'center' }}>
                                <Text as="p" variant="bodyMd" color="subdued">
                                  Searching products...
                                </Text>
                              </div>
                          )}

                          {productResults.length > 0 && (
                              <div style={{
                                maxHeight: '300px',
                                overflow: 'auto',
                                border: '1px solid #e1e1e1',
                                borderRadius: '8px'
                              }}>
                                {productResults.map((product) => {
                                  const isAlreadyLinked = existingProducts.some(
                                    existingProduct => existingProduct.productId === product.id
                                  );

                                  return (
                                    <div
                                        key={product.id}
                                        style={{
                                          padding: '12px',
                                          borderBottom: '1px solid #f0f0f0',
                                          cursor: isAlreadyLinked ? 'not-allowed' : 'pointer',
                                          backgroundColor: selectedProduct?.id === product.id ? '#f6f6f7' :
                                                          isAlreadyLinked ? '#fff5f5' : 'white',
                                          opacity: isAlreadyLinked ? 0.6 : 1
                                        }}
                                        onClick={() => {
                                          if (isAlreadyLinked) {
                                            setToaster("This product is already linked to this post!");
                                            return;
                                          }

                                          if (selectedProduct?.id === product.id) {
                                            setSelectedProduct(null); // Deselect if already selected
                                          } else {
                                            setSelectedProduct(product); // Select new product
                                          }
                                        }}
                                    >
                                      <InlineStack gap="300" align="space-between">
                                        <InlineStack gap="300">
                                          <div style={{
                                            width: '60px',
                                            height: '60px',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                          }}>
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                style={{
                                                  width: '100%',
                                                  height: '100%',
                                                  objectFit: 'cover'
                                                }}
                                            />
                                          </div>
                                          <BlockStack gap="100">
                                            <Text as="h4" variant="bodyMd" fontWeight="medium">
                                              {product.title}
                                            </Text>
                                            <Text as="p" variant="bodySm" color="subdued">
                                              Handle: {product.handle}
                                            </Text>
                                            <Text as="p" variant="bodySm" color="subdued">
                                              SKU: {product.sku}
                                            </Text>
                                            <Text as="p" variant="bodySm" color="subdued">
                                              Inventory: {product.inventory} units
                                            </Text>
                                          </BlockStack>
                                        </InlineStack>

                                        <BlockStack gap="100" alignment="end">
                                          <Text as="p" variant="bodyMd" fontWeight="medium">
                                            {product.price}
                                          </Text>
                                          {isAlreadyLinked ? (
                                              <Badge tone="critical" size="small">
                                                Already Added
                                              </Badge>
                                          ) : selectedProduct?.id === product.id ? (
                                              <Badge tone="success" size="small">
                                                Selected (Click to deselect)
                                              </Badge>
                                          ) : null}
                                        </BlockStack>
                                      </InlineStack>
                                    </div>
                                  );
                                })}
                              </div>
                          )}

                          {productSearchQuery && productResults.length === 0 && !isProductLoading && (
                              <div style={{ padding: '20px', textAlign: 'center' }}>
                                <Text as="p" variant="bodyMd" color="subdued">
                                  No products found matching "{productSearchQuery}"
                                </Text>
                              </div>
                          )}
                        </BlockStack>
                      </BlockStack>
                    </Card>

                    {selectedProduct && (
                      <Card>
                        <BlockStack gap="400" padding="400">
                          <Text as="h3" variant="headingMd">
                            Selected Product
                          </Text>
                          <div style={{
                            padding: '16px',
                            backgroundColor: '#f6f6f7',
                            borderRadius: '8px',
                            border: '2px solid #00a047'
                          }}>
                            <InlineStack gap="400" align="space-between">
                              <InlineStack gap="300">
                                <div style={{
                                  width: '60px',
                                  height: '60px',
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                  border: '1px solid #e1e1e1'
                                }}>
                                  <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.title}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                                <BlockStack gap="100">
                                  <Text as="h4" variant="headingSm" fontWeight="semibold">
                                    {selectedProduct.title}
                                  </Text>
                                  <Text as="p" variant="bodySm" color="subdued">
                                    {selectedProduct.price} • {selectedProduct.inventory} in stock
                                  </Text>
                                  <Text as="p" variant="bodySm" color="subdued">
                                    SKU: {selectedProduct.sku}
                                  </Text>
                                </BlockStack>
                              </InlineStack>
                              <InlineStack gap="200">
                                <Badge tone="success">
                                  Selected
                                </Badge>
                                <Button
                                  size="micro"
                                  onClick={() => setSelectedProduct(null)}
                                  variant="plain"
                                >
                                  Deselect
                                </Button>
                              </InlineStack>
                            </InlineStack>
                          </div>
                        </BlockStack>
                      </Card>
                    )}

                    <InlineStack gap="300" align="end">
                      <Button onClick={handleProductModalClose}>
                        Cancel
                      </Button>
                      <Button
                          primary
                          onClick={async () => {
                            if (selectedProduct) {
                              await handleProductSelect(selectedPostId, selectedProduct);
                            }
                          }}
                          disabled={!selectedProduct}
                      >
                        Link Product
                      </Button>

                    </InlineStack>
                  </BlockStack>
                </Box>
              </Modal>



              {/* Welcome Modal */}
              <Modal open={showWelcomeModal} onHide={handleWelcomeClose} variant={"large"}>
                <Box padding={"400"}>
                  <BlockStack gap="400" alignment="center">
                    <Text as="h1" variant="headingLg" alignment="center">
                      Welcome to Instafeed! 🎉
                    </Text>
                    <Text as="p" variant="bodyMd" alignment="center">
                      Thank you for installing our Instagram feed app! Here's what you can do:
                    </Text>
                    <List type="bullet">
                      <List.Item>Connect your Instagram business account</List.Item>
                      <List.Item>Select posts to display in your store</List.Item>
                      <List.Item>Customize your feed appearance</List.Item>
                      <List.Item>Display Instagram content on your storefront</List.Item>
                    </List>
                    <Text as="p" variant="bodyMd" alignment="center">
                      Ready to get started? Click "Get Started" to begin connecting your Instagram account.
                    </Text>
                    <InlineStack gap="300" alignment="center">
                      <Button onClick={handleWelcomeClose}>
                        Skip Introduction
                      </Button>
                      <Button primary onClick={handleWelcomeClose}>
                        Get Started
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Box>
              </Modal>
            </ClientOnly>
          </Layout>
        </Page>
      </Frame>

  ) : (
      <PricingPage/>
  );
}

export const PricingPage=()=>{
  const navigate = useNavigate();

  return (
      <Frame>
          <Page title={'Pricing'}>
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <BlockStack gap={"400"}>
                    <Text as={"h4"} variant={"headingMd"}>
                      $2 / month
                    </Text>
                    <Text as="h1" variant="headingLg">
                      Start with a 7-day free trial.
                    </Text>

                    <List type="bullet">
                      <List.Item>Unlimited access to Instagram feed features.</List.Item>
                      <List.Item>Priority support</List.Item>
                      <List.Item>And more...</List.Item>
                    </List>

                    <InlineStack align="start">
                      <Button onClick={() => navigate("/app/plan")} primary>
                        Subscribe
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </Page>
      </Frame>
  )
}

export function ErrorBoundary (){
  const error = useRouteError();

  let title = "Oops! Something went wrong.";
  let message = "Sorry, we ran into a problem. Please try again later.";

  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = `${error.status} - ${error.statusText}`;
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
      <Page narrowWidth>
        <Card>
          <BlockStack gap="500" alignment="center" padding="500">
            <Icon source={AlertCircleIcon} color="critical" />

            <Text as="h1" variant="headingLg" alignment="center">
              {title}
            </Text>

            <Text as="p" variant="bodyMd" alignment="center">
              {message}
            </Text>

            {status === 404 && (
                <Text as="p" variant="bodySm" color="subdued">
                  The page you're looking for couldn't be found.
                </Text>
            )}
            <BlockStack gap="300">
              <Button
                  primary
                  onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>

              <Link to="/">
                <Button>Back to Home</Button>
              </Link>
            </BlockStack>


          </BlockStack>
        </Card>
      </Page>
  );
}
