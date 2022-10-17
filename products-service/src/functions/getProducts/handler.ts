import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import createError from "http-errors";

import { Product } from "src/types/product";
import schema from "./schema";
import productService from "@services/product-service";

export const getProducts: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  try {
    const products: Array<Product> = productService.getProducts();
    
    return formatJSONResponse({
      items: products,
    });
  } catch (err) {
    throw new createError.InternalServerError();
  }
};

export const main = middyfy(getProducts);