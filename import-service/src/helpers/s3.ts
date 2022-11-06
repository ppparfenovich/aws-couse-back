import AWS from 'aws-sdk';
import csvParser from "csv-parser";

const BUCKET = 'aws-shop-import';
const REGION = 'eu-west-1';
const EXPIRATION_TIME = 120; // 2 minutes

const s3 = new AWS.S3({ region: REGION });
const sqs = new AWS.SQS({ region: REGION });

const deleteObject = async (key) => {
  await s3.deleteObject({
    Bucket: BUCKET,
    Key: key,
  }).promise();
};

const copyObject = async (fromKey, toKey) => {
  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${fromKey}`,
    Key: toKey,
  }).promise();
};

const moveObject = async (fromKey, toKey) => {
  await copyObject(fromKey, toKey);
  await deleteObject(fromKey);
};

export const getSignedUrl = (name) => {
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    Expires: EXPIRATION_TIME,
    ContentType: 'text/csv',
  };

  return s3.getSignedUrlPromise('putObject', params);
};

export const importFile = (record) => {
  const { key } = record.s3.object;
  const params = {
    Bucket: BUCKET,
    Key: key,
  };

  const stream = s3.getObject(params).createReadStream();

  return new Promise((resolve, reject) => {
    stream
      .pipe(csvParser())
      .on('data', (data) => {
        console.log('Parsed data: ', data);
        const message = JSON.stringify(data);
        sqs.sendMessage(
          {
            QueueUrl: process.env.SQS_URL,
            MessageBody: message
          }, () => {
            console.log('Send message: ', message)
          }
        )
      })
      .on('error', (error) => {
        reject(error);
      })
      .on('end', async () => {
        const newKey = key.replace('uploaded', 'parsed');
        const res = await moveObject(key, newKey);

        resolve(res);
      });
  });
};