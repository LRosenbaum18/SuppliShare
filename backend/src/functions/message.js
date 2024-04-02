const { app, output, trigger } = require('@azure/functions');

const wpsMsg = output.generic({
    type: 'webPubSub',
    name: 'actions',
    hub: 'simplechat',
});

const wpsTrigger = trigger.generic({
    type: 'webPubSubTrigger',
    name: 'request',
    hub: 'simplechat',
    eventName: 'message',
    eventType: 'user'
});

app.generic('message', {
    trigger: wpsTrigger,
    extraOutputs: [wpsMsg],
    handler: async (request, context) => {
        const messageData = JSON.parse(request.data);
        const userId = context.triggerMetadata.connectionContext.userId;

        if (messageData.recipientUserId) {
            // Direct message to a specific user
            context.extraOutputs.set(wpsMsg, [{
                "actionName": "sendToUser",
                "userId": messageData.recipientUserId,
                "data": JSON.stringify({
                    from: userId,
                    message: messageData.message
                }),
                "dataType": "json"
            }]);
        } else {
            // Broadcast message to all users
            context.extraOutputs.set(wpsMsg, [{
                "actionName": "sendToAll",
                "data": JSON.stringify({
                    from: userId,
                    message: messageData.message
                }),
                "dataType": "json"
            }]);
        }

        return {
            data: "[SYSTEM] Message processed.",
            dataType: "text",
        };
    }
});
