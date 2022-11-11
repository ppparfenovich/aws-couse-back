import { formatJSONErrorResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import productService from "@services/product-service";
import stockService from "@services/stock-service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { publish } from "src/helpers/sns";
import { Product } from "src/utils/types";

interface ICatalogBatchEvent extends APIGatewayProxyEvent {
  Records: {
    body: string;
  }[];
}

export const catalogBatchProcess = async ({ Records }: ICatalogBatchEvent) => {
  try {
    await Promise.all(Records.map(async (record) => {
      const recordBody = JSON.parse(record.body);
      const { title, description, price, count } = recordBody;

      const product = {
        id: '',
        title,
        description,
        price,
      } as Product

      const id = await productService.createProduct(product)

      await stockService.createStock({ product_id: id, count })

      await publish(product);
    }));
    
    console.log('sns queue publish completed');
  } catch (err) {
    return formatJSONErrorResponse(err, 500)
  }
}

export const main = middyfy(catalogBatchProcess)