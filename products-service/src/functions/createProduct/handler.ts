import {
  formatJSONErrorResponse,
  formatJSONSuccessResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'
import { Product } from 'src/utils/types'
import productService from '@services/product-service'
import stockService from '@services/stock-service'

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.log('Lambda createProducts called! Body: ' + JSON.stringify(event.body))

    const count = event.body.count as number
    const product = {
      id: '',
      title: event.body.title,
      description: event.body.description,
      price: event.body.price,
    } as Product

    if (!product.title || !product.price || !count) {
      return formatJSONErrorResponse(
        "Your request isn't valid. Please fill title, price and count",
        400
      )
    }

    const id = await productService.createProduct(product)

    await stockService.createStock({ product_id: id, count })

    return formatJSONSuccessResponse({
      items: [{ id, ...event.body }],
    })
  } catch (err) {
    return formatJSONErrorResponse(err, 500)
  }
}

export const main = middyfy(createProduct)