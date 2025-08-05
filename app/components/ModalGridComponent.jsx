import {
  Grid,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Badge,
  Box,
  Icon,
  Button,
} from "@shopify/polaris";
import { PlayIcon, ExternalIcon } from "@shopify/polaris-icons";

const ModalGridComponent = ({ posts, productCounts = {} }) => {
  return (
    <BlockStack gap="500">
      <BlockStack gap="300">
        <Text as="h2" variant="headingLg">
          Selected Instagram Posts ({posts?.filter((post) => post.selected).length || 0})
        </Text>
        <Text as="p" variant="bodyMd" color="subdued">
          These posts will be displayed in your Instagram feed on your storefront.
        </Text>
      </BlockStack>

      <Grid>
        {posts
          ?.filter((post) => post.selected)
          .map((post) => (
            <Grid.Cell
              key={post.id}
              columnSpan={{ xs: 6, sm: 4, md: 3, lg: 3 }}
            >
              <Card>
                <div style={{ position: "relative" }}>
                  {/* Selected badge overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: "10",
                    }}
                  >
                    <Badge tone="success" size="small">
                      ✓ Selected
                    </Badge>
                  </div>

                  {/* External link button */}
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
                    <Button
                      icon={ExternalIcon}
                      variant="plain"
                      size="micro"
                      onClick={() => window.open(post.permalink, "_blank")}
                      accessibilityLabel="View on Instagram"
                    />
                  </div>

                  {/* Post image/video */}
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

                {/* Post details */}
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

                    {/* Badges */}
                    <InlineStack gap="100" align="start">
                      <Badge 
                        tone="success"
                        size="small"
                      >
                        Selected for Display
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
      
      {posts?.filter((post) => post.selected).length === 0 && (
        <BlockStack alignment="center" gap="400">
          <Text as="h3" variant="headingMd">No Posts Selected</Text>
          <Text as="p" variant="bodyMd" color="subdued">
            Select some Instagram posts from the main page to display them here.
          </Text>
        </BlockStack>
      )}
    </BlockStack>
  );
};

export default ModalGridComponent;
