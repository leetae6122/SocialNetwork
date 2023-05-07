const { ObjectId } = require("mongodb");

class MessageService {
    constructor(client) {
        this.Message = client.db().collection("messages");
    }
    extractMessageData(payload) {
        const Message = {
            conversationId: payload.conversationId,
            senderId: payload.senderId,
            text: payload.text,
            createdAt: payload.createdAt
        };
        Object.keys(Message).forEach(
            (key) => Message[key] === undefined && delete Message[key]
        );
        return Message;
    }

    async findById(id) {
        const cursor = await this.Message.find({
            conversationId: id.toString()
        })
        return await cursor.toArray();
    }

    async create(payload) {
        const message = this.extractMessageData({...payload,createdAt: new Date().getTime()});

        const result = await this.Message.findOneAndUpdate(
            message,
            {
                $set: {
                    createdAt: new Date().getTime(),
                },
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Message.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = MessageService;