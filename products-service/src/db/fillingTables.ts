import { productsList } from "@mocks/productsList";
import { stocksList } from "@mocks/stocksLists";
import { TABLE_NAMES } from "src/utils/constants";
import { dynamoDB } from "./tools";

productsList.forEach(async (product) => {
  await dynamoDB.put({
    TableName: TABLE_NAMES.PRODUCTS,
    Item: { ...product }
  }).promise()
})

stocksList.forEach(async (stock) => {
  await dynamoDB.put({
    TableName: TABLE_NAMES.PRODUCTS,
    Item: { ...stock }
  }).promise()
})
