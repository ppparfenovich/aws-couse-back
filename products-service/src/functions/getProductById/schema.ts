export default {
  type: 'object',
  pathParams: {
    id: { 
      type: 'string',
      required: true
    },
  },
} as const;
