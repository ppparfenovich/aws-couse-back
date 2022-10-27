import { dynamoDB } from 'src/db/tools'
import { TABLE_NAMES } from 'src/utils/constants'
import { Stock } from 'src/utils/types'

class StockService {
  public async getStocks() {
    const stocks = (
      await dynamoDB
        .scan({
          TableName: TABLE_NAMES.STOCKS,
        })
        .promise()
    ).Items

    return stocks as Stock[]
  }
  public async getStockByProductId(id: string) {
    const foundStock = (
      await dynamoDB
        .query({
          TableName: TABLE_NAMES.STOCKS,
          KeyConditionExpression: `product_id = :id`,
          ExpressionAttributeValues: { ':id': id },
        })
        .promise()
    ).Items[0]

    return foundStock as Stock
  }

  public async createStock(stock: Stock): Promise<void> {
    await dynamoDB
      .put({
        TableName: TABLE_NAMES.STOCKS,
        Item: { ...stock },
      })
      .promise()
  }
}

export default new StockService()