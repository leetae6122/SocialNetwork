const { ObjectId } = require("mongodb");

class ConversationService {
    constructor(client) {
        this.Conversation = client.db().collection("conversations");
    }
    extractConversationData(payload) {
        const Conversation = {
            members: payload.members,
            createdAt: payload.createdAt
        };
        Object.keys(Conversation).forEach(
            (key) => Conversation[key] === undefined && delete Conversation[key]
        );
        return Conversation;
    }

    async findById(id) {
        return await this.Comment.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findAllByUserId(uid) {
        const cursor = await this.Conversation.find({members: {$in:[uid]}});
        return await cursor.toArray();
    }


    async findOneByUserId(uid, uidConnect) {
        return await this.Conversation.findOne({
            $and: [
                { members: uid },
                { members: uidConnect }
            ]
        });
    }

    async findAll(PostID) {
        const cursor = await this.Comment.aggregate([
            { $match: { _pid: PostID } },
            { $sort: { date_created: 1 } }
        ]);
        return await cursor.toArray();
    }

    async create(payload) {
        const conversation = this.extractConversationData(payload);

        const result = await this.Conversation.findOneAndUpdate(
            conversation,
            {
                $set: {
                    createdAt: new Date(),
                },
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractCommentData(payload);
        const result = await this.Comment.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Comment.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = ConversationService;