const { app, input} = require("@azure/functions");

const connection = input.generic({
    type: 'webPubSubConnection',
    name: 'connection',
    userId: '{query.user}',
    hub: 'simplechat'
});

app.http("negotiate", {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [connection],
    handler: async (request, context) => {
        context.log(`HTTP function processed request for URL "${request.url}"`);

        return { body: JSON.stringify(context.extraInputs.get('connection')) };
    },
});
