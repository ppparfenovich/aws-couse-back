import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        request: {
          parameters: {
            querystrings: {
              name: true,
            }
          }
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: 'arn:aws:lambda:eu-west-1:979985526340:function:authorization-service-dev-basicAuthorizer',
          type: 'TOKEN',
          identitySource: 'method.request.header.Authorization', 
        },
      },
    },
  ],
};