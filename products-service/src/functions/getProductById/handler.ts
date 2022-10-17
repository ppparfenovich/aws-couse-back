import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import productService from "@services/product-service";
import createError from "http-errors";
import schema from "./schema";

export const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const {
    pathParameters: { id },
  } = event;

  const product = productService.getProductById(id);

  if (!product) {
    throw new createError.NotFound();
  }

  return formatJSONResponse({
    items: [product],
  });
};

export const main = middyfy(getProductById);