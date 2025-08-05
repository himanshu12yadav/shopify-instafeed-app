import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

const prisma = global.prisma || new PrismaClient();

export const createOrUpdate = async ({
  instagramId,
  instagramUsername,
  instagramToken,
  instagramTokenExpires,
  accountType,
}) => {
  return prisma.instagramAccount.upsert({
    where: {
      instagramId,
    },
    update: {
      instagramUsername,
      instagramToken,
      instagramTokenExpires,
      accountType,
    },
    create: {
      instagramId,
      instagramUsername,
      instagramToken,
      instagramTokenExpires,
      accountType,
    },
  });
};

export const instagramPostCreateOrUpdate = async ({
  instagramId,
  instagramUsername,
  instagramToken,
  instagramTokenExpires,
  accountType,
}) => {
  return prisma.instagramAccount.upsert({
    where: {
      instagramId,
    },
    update: {
      instagramUsername,
      instagramToken,
      instagramTokenExpires,
      accountType,
    },
    create: {
      instagramId,
      instagramUsername,
      instagramToken,
      instagramTokenExpires,
      accountType,
    },
  });
};

export const getAllInstagramAccounts = async () => {
  return prisma.instagramAccount.findMany({
    include: {
      posts: true,
    },
  });
};

export const getAccountDeletionDetails = async (accountId) => {
  // Get all posts associated with this account
  const posts = await prisma.instagramPost.findMany({
    where: {
      accountId: accountId,
    },
    include: {
      products: true,
    },
  });

  const postIds = posts.map(post => post.id);
  
  // Count total product links
  const totalProductLinks = posts.reduce((sum, post) => sum + post.products.length, 0);

  return {
    postsCount: posts.length,
    productLinksCount: totalProductLinks,
    selectedPostsCount: posts.filter(post => post.selected).length,
  };
};

export const deleteInstagramAccount = async (accountId) => {
  // First, get all posts associated with this account
  const posts = await prisma.instagramPost.findMany({
    where: {
      accountId: accountId,
    },
    select: {
      id: true,
    },
  });

  // Delete all product links associated with the posts
  if (posts.length > 0) {
    const postIds = posts.map(post => post.id);
    await prisma.instagramPostProduct.deleteMany({
      where: {
        postId: {
          in: postIds,
        },
      },
    });
  }

  // Then delete all posts associated with the account
  await prisma.instagramPost.deleteMany({
    where: {
      accountId: accountId,
    },
  });
  
  // Finally delete the account
  return prisma.instagramAccount.delete({
    where: {
      id: accountId,
    },
  });
};

export const findUserByInstagramId = async (instagramId) => {
  return prisma.instagramAccount.findUnique({
    where: {
      instagramId: instagramId,
    },
  });
};

export const findUserByInstagramUsername = async (instagramUsername) => {
  return prisma.instagramAccount.findFirst({
    where: {
      instagramUsername: instagramUsername,
    },
    include: {
      posts: true,
    },
  });
};

// all post-related functions

export const getPosts = async () => {
  return prisma.instagramPost.findMany();
};

export const deleteAllPostByAccountId = async (accountId) => {
  // First, delete all InstagramPostProduct records for posts in this account
  await prisma.instagramPostProduct.deleteMany({
    where: {
      post: {
        accountId: accountId,
      },
    },
  });

  // Then delete all Instagram posts for this account
  return prisma.instagramPost.deleteMany({
    where: {
      accountId: accountId,
    },
  });
};

export const getAllInstagramPostbyCondition = async (condition) => {
  try {
    const posts = await prisma.instagramPost.findMany({
      include: {
        account: true,
      },
      where: { ...condition },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return { error: "Failed to fetch posts", details: error };
  }
};

export const findPostById = async (postId) => {
  return prisma.instagramPost.findUnique({
    where: {
      id: postId,
    },
  });
};

export const updatePostData = async (postId, fieldName, fieldValue) => {
  return prisma.instagramPost.update({
    where: {
      id: String(postId),
    },
    data: {
      [fieldName]: fieldValue,
    },
  });
};

export const storeInstagramPosts = async (posts = [], accountId) => {
  try {
    for (const post of posts) {
      // Check if post already exists
      const existingPost = await prisma.instagramPost.findUnique({
        where: { id: post.id },
      });

      if (!existingPost) {
        await prisma.instagramPost.create({
          data: {
            id: post.id,
            mediaType: post.media_type,
            mediaUrl: post.media_url,
            thumbnailUrl: post.thumbnail_url || null,
            permalink: post.permalink,
            timestamp: new Date(post.timestamp),
            username: post.username,
            caption: post.caption || null,
            accountId: accountId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }
  } catch (error) {
    console.error("Error storing Instagram posts:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllInstagramPostbyAccountId = async (accountId) => {
  return prisma.instagramPost.findMany({
    where: {
      accountId: accountId,
    },
  });
};

export const getFilteredInstagramPosts = async (
  searchQuery,
  filterValue,
  username,
) => {
  const whereClauses = {
    AND: [
      {
        username: username,
      },
      ...(searchQuery
        ? [
            {
              caption: {
                contains: searchQuery,
              },
            },
          ]
        : []),
      {
        mediaType: filterValue !== "all" ? filterValue : undefined,
      },
    ],
  };

  if (!searchQuery && filterValue === "all") {
    return prisma.instagramPost.findMany({
      where: {
        username: username,
      },
      include: {
        account: true,
      },
    });
  }

  const posts = await prisma.instagramPost.findMany({
    where: whereClauses,
    include: {
      account: true,
    },
  });

  return posts;
};

export async function addProductToPost(postId, productData) {
  return await prisma.instagramPostProduct.create({
    data: {
      postId,
      productId: productData.id,
      productTitle: productData.title,
      productHandle: productData.handle,
      productImage: productData.image?.url || null,
      productPrice: productData.price || null,
    },
  });
}

// Remove product from Instagram post
export async function removeProductFromPost(postId, productId) {
  return await prisma.instagramPostProduct.deleteMany({
    where: {
      postId,
      productId,
    },
  });
}

export async function getProductsForPost(postId) {
  return await prisma.instagramPostProduct.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Get posts with their products
export async function getPostsWithProducts(accountId) {
  return await prisma.instagramPost.findMany({
    where: {
      accountId,
    },
    include: {
      products: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
}

// Get product counts for all posts in an account
export async function getProductCountsForPosts(accountId) {
  const posts = await prisma.instagramPost.findMany({
    where: {
      accountId,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  // Return a map of postId -> product count
  const counts = {};
  posts.forEach(post => {
    counts[post.id] = post._count.products;
  });

  return counts;
}




export default prisma;
