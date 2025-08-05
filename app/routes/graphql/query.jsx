export async function createSubscription(admin, returnUrl) {
  const CREATE_SUBSCRIPTION_MUTATION = `
   mutation CreateAppSubscription{
    appSubscriptionCreate(
    name:"Pro Plan",
    returnUrl:"${returnUrl}",
    test:${process.env.NODE_ENV !== "production"},
    lineItems:[
     {
      plan:{
        appRecurringPricingDetails:{
          price:{
            amount:2,
            currencyCode:"USD"
          }
          interval:"EVERY_30_DAYS"
        }
      }
     }
    ]){
      appSubscription{
        id
        confirmationUrl
      }
      userErrors{
        field
        message
      }
    }
   }
  `;

  const response = await admin.graphql(CREATE_SUBSCRIPTION_MUTATION);
  return response.json();
}

export async function getSubscriptionStatus(admin) {
  const SUBSCRIPTION_QUERY = `
    query {
        currentAppInstallation {
          activeSubscriptions {
            createdAt
            currentPeriodEnd
            id
            lineItems {
              id
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    interval
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            returnUrl
            name
            status
            test
            trialDays
          }
        }
      }
  `

  const response = await admin.graphql(SUBSCRIPTION_QUERY, {
    variables: {},
  });

  return await response.json();
}

export async function getSubscriptionDetails(admin, subscriptionId) {
  const SUBSCRIPTION_DETAIL_QUERY = `
    query SubscriptionDetails($id: ID!) {
      appSubscription(id: $id) {
        id
        name
        status
        trialEndsOn
        currentPeriodEnd
        createdAt
        test
        lineItems {
          plan {
            pricingDetails {
              ... on AppRecurringPricing {
                price {
                  amount
                  currencyCode
                }
                interval
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await admin.graphql(SUBSCRIPTION_DETAIL_QUERY, {
      variables: {
        id: subscriptionId,
      },
    });

    const { data, errors } = await response.json();

    if (errors) {
      console.error(errors);
      return null;
    }

    return data.appSubscription;
  } catch (error) {
    console.log("Failed to fetch subscription details: ", error);
    return null;
  }
}

export async function appSubscriptionCancel(admin, subscriptionId) {
  const CANCEL_SUBSCRIPTION_MUTATION = `
  mutation AppSubscriptionCancel($id: ID!, $prorate:Boolean) {
    appSubscriptionCancel(id: $id, prorate: $prorate) {
      userErrors {
        field
        message
      }
      appSubscription {
        id
        status
        returnUrl
      }
    }
  }
  `;

  const response = await admin.graphql(CANCEL_SUBSCRIPTION_MUTATION, {
    variables:{
      id: subscriptionId,
      prorate: true,
    }
  });

  const responseData = await response.json();
  return responseData.data;

}

export async function searchProducts(admin, query, limit = 20) {
  const SEARCH_PRODUCTS_QUERY = `
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            status
            featuredImage {
              url
              altText
            }
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            totalInventory
            variants(first: 1) {
              edges {
                node {
                  id
                  sku
                  inventoryQuantity
                  price
                }
              }
            }
            createdAt
            updatedAt
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  try {
    const response = await admin.graphql(SEARCH_PRODUCTS_QUERY, {
      variables: {
        query: query,
        first: limit,
      },
    });

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL errors:', errors);
      return { products: [], hasNextPage: false };
    }

    const products = data.products.edges.map(edge => {
      const product = edge.node;
      const firstVariant = product.variants.edges[0]?.node;
      
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        status: product.status,
        image: product.featuredImage?.url || 'https://via.placeholder.com/60x60',
        imageAlt: product.featuredImage?.altText || product.title,
        price: firstVariant?.price ? `$${firstVariant.price}` : 'N/A',
        priceRange: {
          min: product.priceRangeV2.minVariantPrice.amount,
          max: product.priceRangeV2.maxVariantPrice.amount,
          currency: product.priceRangeV2.minVariantPrice.currencyCode,
        },
        sku: firstVariant?.sku || 'N/A',
        inventory: product.totalInventory || 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return {
      products,
      hasNextPage: data.products.pageInfo.hasNextPage,
      pageInfo: data.products.pageInfo,
    };
  } catch (error) {
    console.error('Failed to search products:', error);
    return { products: [], hasNextPage: false };
  }
}

export async function getProductById(admin, productId) {
  const GET_PRODUCT_QUERY = `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        status
        description
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        totalInventory
        variants(first: 10) {
          edges {
            node {
              id
              title
              sku
              inventoryQuantity
              price
              compareAtPrice
              availableForSale
            }
          }
        }
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const response = await admin.graphql(GET_PRODUCT_QUERY, {
      variables: {
        id: productId,
      },
    });

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL errors:', errors);
      return null;
    }

    return data.product;
  } catch (error) {
    console.error('Failed to get product:', error);
    return null;
  }
}

