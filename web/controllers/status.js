import { shopify } from "../core/index.js";

const STATUS_QUERY = `{
  productsCount {
    count
  }
  customersCount {
    count
  }
  ordersCount {
    count
  }
}`;

export const statusController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @description Retrieve a summary of the integration status
   */
  async summary(req, res) {
    try {
      const {
        locals: {
          shopify: { session },
        },
      } = res;

      const client = new shopify.api.clients.Graphql({ session });

      const {
        data: {
          productsCount: { count: products },
          customersCount: { count: customers },
          ordersCount: { count: orders },
        },
      } = await client.request(STATUS_QUERY);

      res.status(200).json({ products, customers, orders });
    } catch (error) {
      console.log(error);

      res.status(400).send();
    }
  },
};
