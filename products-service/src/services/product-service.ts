import { v4 } from "uuid";

import { TABLE_NAMES } from "src/utils/constants";
import { Product } from "src/utils/types";
import { dynamoDB } from "src/db/tools";

class ProductService {
  public async getProductById(id: string) {
    const foundProduct = (
      await dynamoDB
        .query({
          TableName: TABLE_NAMES.PRODUCTS,
          KeyConditionExpression: `id = :id`,
          ExpressionAttributeValues: { ':id': id },
        })
        .promise()
    ).Items[0]

    return foundProduct as Product
  }

  public async getProducts() {
    const products = (
      await dynamoDB
        .scan({
          TableName: TABLE_NAMES.PRODUCTS,
        })
        .promise()
    ).Items

    return products as Product[]
  }

  public async createProduct(product: Partial<Product>): Promise<string> {
    const id = v4()

    await dynamoDB
      .put({
        TableName: TABLE_NAMES.PRODUCTS,
        Item: { ...product, id },
      })
      .promise()

    return id
  }
}

export default new ProductService();