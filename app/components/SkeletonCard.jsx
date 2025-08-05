import {
  BlockStack,
  Box,
  SkeletonBodyText,
  SkeletonThumbnail,
  Grid
} from "@shopify/polaris";

export const SkeletonCard = () => {
  return (
    <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
      <div style={{ position: "relative" }}>
        <BlockStack gap="500">
          <Box
            background="bg-subdued"
            borderRadius="100"
            width="20px"
            height="20px"
            style={{
              animation:
                "polaris-SkeletonShimmerAnimation 2.5s linear infinite",
            }}
          />
          <div style={{ width: "100%" }}>
            <SkeletonThumbnail
              style={{
                height: "400px !important",
                objectFit: "cover",
                aspectRatio: "1/1",
              }}
            />
          </div>

          <SkeletonBodyText lines={2} />
        </BlockStack>
      </div>
    </Grid.Cell>
  );
};

