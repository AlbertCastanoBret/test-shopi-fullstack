import { shopify } from "../core/index.js";

 const PRODUCT_DETAILS_QUERY = `
    query ($id: ID!) {
        product(id: $id) {
            id
            title
            status
            category {
                name
            }
            description
            vendor
            totalInventory
            priceRangeV2 {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
        }
    }
`;

export const productController = {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @description Retrieve a list of details for a specific product
     */
    async getProductDetailsById(req, res) {``
        try {
            const {
                locals: {
                    shopify: { session },
                },
            } = res;

            const client = new shopify.api.clients.Graphql({ session });
            const productId = req.query.id;

            const response = await client.request(PRODUCT_DETAILS_QUERY, { 
                variables: { id: "gid://shopify/Product/" + productId }
            });

            if (response.data === null) {
                res.status(404).send();
                return;
            }

            console.log(response.data);

            const productDetails = {
                id: response.data.product.id.replace("gid://shopify/Product/", ""),
                name: response.data.product.title,
                status: response.data.product.status,
                category: response.data.product.category.name,
                description: response.data.product.description,
                vendor: response.data.product.vendor,
                totalInventory: response.data.product.totalInventory,
                priceRange: 
                response.data.product.priceRangeV2.maxVariantPrice.amount 
                + " " + response.data.product.priceRangeV2.minVariantPrice.currencyCode 
                + " - " + 
                response.data.product.priceRangeV2.minVariantPrice.amount
                + " " + response.data.product.priceRangeV2.minVariantPrice.currencyCode
            }

            res.status(200).json(productDetails); 

        } catch (error) {
            console.log(error);

            res.status(400).send();
        }
    }
};