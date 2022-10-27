import { 
  formatJSONErrorResponse, 
  formatJSONSuccessResponse, 
  ValidatedEventAPIGatewayProxyEvent 
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import productService from "@services/product-service";
import stockService from "@services/stock-service";

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    console.log('Lambda getProducts called!')

    const [products, stocks] = await Promise.all([
      productService.getProducts(),
      stockService.getStocks(),
    ])

    const productIdList = products.map((product) => product.id)

    const filteredStocks = stocks.filter((stock) =>
      productIdList.includes(stock.product_id)
    )

    const res = []

    products.forEach((product) => {
      const { id } = product
      const stock = filteredStocks.find((stock) => stock.product_id === id)

      res.push({ ...product, count: stock?.count || 0 })
    })

    return formatJSONSuccessResponse({
      items: res,
    });
  } catch (err) {
    return formatJSONErrorResponse(err, 500);
  }
};

export const main = middyfy(getProductsList);