// Azure Function: negotiate
const { app, input } = require('@azure/functions');

const connection = input.generic({
    type: 'webPubSubConnection',
    name: 'connection',
    hub: 'simplechat'
});

app.http('negotiate', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [connection],
    handler: async (request, context) => {
        const userId = request.query.userId || request.body?.userId;
        context.bindings.connection.userId = userId;
        return { body: JSON.stringify(context.extraInputs.get('connection')) };
    },
});
