import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { HTTP_CODE } from "@libs/httpCodes";
import { importFile } from "src/helpers/s3";

export const importFileParser = async (event) => {
  console.log('Lambda importProductParser called!')
  
  try {
    const records = event.Records || [];

    await Promise.all(records.map(record => importFile(record)));

    return formatJSONResponse(HTTP_CODE.ACCEPTED);
  } catch (err) {
    return formatJSONResponse(HTTP_CODE.SERVER_ERROR, err);
  }
};

export const main = middyfy(importFileParser);