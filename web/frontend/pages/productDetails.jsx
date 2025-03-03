import { useAppBridge } from '@shopify/app-bridge-react';
import { Badge, Bleed, Box, Button, Card, Divider, Form, FormLayout, InlineStack, Layout, Page, Spinner, Text, TextField } from '@shopify/polaris';
import React, { useCallback, useState } from 'react'

export default function ProductDetails() {
    const shopify = useAppBridge();
    const [idProduct, setIdProduct] = useState('');
    const [errorForm, setErrorForm] = useState(false);
    const [productDetails, setProductDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeForm = useCallback((newValue) => {
        setIdProduct(newValue);
        if (errorForm) {
            setErrorForm(false);
        }
    }, [errorForm]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();

        const error = idProduct < 0 || idProduct === "";
        setErrorForm(error);

        if (error) {
            shopify.toast.show('Please fix the errors');
            return;
        }
        
        getProdctDetails();
    }, [idProduct]);

    const getProdctDetails = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/product/?id="+idProduct);
            const data = await response.json();
            setProductDetails(data);
        } catch (error) {
            setIsLoading(false);
            setProductDetails({errorData: "Product not found"});
            console.log(error);
        } finally {
            setIsLoading(false);
            shopify.toast.show('Product details retrieved successfully');
        }
    }
    
  return <Page title="Product Details" narrowWidth>
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
            label="ID Product"
            type='number' 
            value={idProduct}
            error={errorForm ? "Please, enter a valid ID Product" : ""}
            autoComplete="off"
            onChange={handleChangeForm} 
        />
        <Button submit>Submit</Button>
        <Bleed marginBlockEnd={400}></Bleed>
      </FormLayout>
      <Layout>
        <Layout.Section>
            <Card padding="0">
                {
                    !isLoading ? Object.values(productDetails).map((item, index) => (
                        <div key={index}>
                            <Box padding="300">
                                <InlineStack align="space-between">
                                    <Text as="p" variant="headingMd">
                                        {String(Object.keys(productDetails)[index]).charAt(0).toUpperCase() + 
                                        String(Object.keys(productDetails)[index]).slice(1)}:
                                    </Text>
                                    {
                                        Object.keys(productDetails)[index] !== "status" ?
                                        <Text>{item}</Text>
                                        :
                                        <Badge 
                                            progress="complete" size="small" 
                                            tone={item === "ACTIVE" ? "success" : "attention"}
                                        >
                                            <Text>{item}</Text>
                                        </Badge>
                                    }
                                </InlineStack>
                            </Box>
                            <Divider></Divider>
                        </div>
                    ))
                    :
                    <Box padding="300">
                        <InlineStack align="center" gap={200}>
                            <Text>Loading...</Text>
                            <Spinner size="small" />
                        </InlineStack>
                    </Box>
                }
            </Card>
        </Layout.Section>
      </Layout>
    </Form>
    </Page>;
}
