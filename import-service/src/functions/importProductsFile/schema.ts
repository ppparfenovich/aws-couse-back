export default {
  type: 'object',
  queryStringParameters: {
    name: {
      type: 'string',
      require: true
    },
  }
} as const