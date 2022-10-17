import { 
  formatJSONErrorResponse,
  formatJSONSuccessResponse, 
  ValidatedEventAPIGatewayProxyEvent 
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import productService from "@services/product-service";
import stockService from "@services/stock-service";
import schema from "./schema";

export const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const id = event.pathParameters.id

    const [product, stock] = await Promise.all([
      productService.getProductById(id),
      stockService.getStockByProductId(id),
    ])
  
    if (!product) {
      return formatJSONErrorResponse(
        `Product with id ${id} was not found`,
        404
      )
    }
  
    const count = stock?.count || 0
  
    return formatJSONSuccessResponse({
      items: [{
        ...product,
        count
      }],
    });
  } catch (err) {
    return formatJSONErrorResponse(err, 500)
  }
};

export const main = middyfy(getProductById);