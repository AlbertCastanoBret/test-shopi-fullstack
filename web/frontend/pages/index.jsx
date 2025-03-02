import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Badge,
  Box,
  Card,
  Divider,
  InlineStack,
  Layout,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";

export default function HomePage() {
  const [summary, setSummary] = useState({ products: 0, collections: 0 });
  const shopify = useAppBridge();

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch("/api/status");

      return await response.json();
    },
  });

  useEffect(() => {
    if (!isLoading && data) setSummary(data);
  }, [isLoading, data]);

  useEffect(() => {
    shopify.loading(isLoading);
  }, [isLoading]);

  return (
    <Page title="Integration status" narrowWidth>
      <Layout>
        <Layout.Section>
          <Card padding="0">
          {
              !isLoading && Object.values(summary).map((item, index) => (
                <>
                  <Box key={item.id} padding="300">
                    <InlineStack align="space-between">
                      <Text as="p" variant="headingMd">
                        {String(Object.keys(summary)[index]).charAt(0).toUpperCase() + 
                        String(Object.keys(summary)[index]).slice(1)}:
                      </Text>
                      <InlineStack gap="200">
                        <Text>{item}</Text>
                        {isLoading ? (
                          <Spinner size="small" />
                        ) : (
                          <Badge progress="complete" size="small" tone="success">
                            Done
                          </Badge>
                        )}
                      </InlineStack>
                    </InlineStack>
                  </Box>
                  <Divider></Divider>
                </>
              ))
            }
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
