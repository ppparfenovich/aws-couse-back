import { 
  formatJSONResponse, 
  ValidatedEventAPIGatewayProxyEvent 
} from "@libs/api-gateway";
import { HTTP_CODE } from "@libs/httpCodes";
import { middyfy } from "@libs/lambda";
import { getSignedUrl } from "src/helpers/s3";
import schema from "./schema";

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Lambda importProductFile called!')
  const { name } = event.queryStringParameters;
  
  try {
    const url = await getSignedUrl(name);

    return formatJSONResponse(HTTP_CODE.OK, { url });
  } catch (err) {
    return formatJSONResponse(HTTP_CODE.SERVER_ERROR, err);
  }
};

export const main = middyfy(importProductsFile);