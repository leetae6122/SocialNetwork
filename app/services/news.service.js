const { ObjectId } = require("mongodb");

class NewsService {
    constructor(client) {
        this.News = client.db().collection("news");
    }
    extractNewsData(payload) {
        const news = {
            _receiveUid: payload._receiveUid,
            _sendUid: payload._sendUid,
            type: {
                add_friend: payload.add_friend,
                new_comment: payload.new_comment
            },
            readed: payload.readed,
            confirm: payload.confirm,
        };
        Object.keys(news).forEach(
            (key) => news[key] === undefined && delete news[key]
        );
        Object.keys(news.type).forEach(
            (key) => news.type[key] === undefined && delete news.type[key]
        );
        if (Object.keys(news.type).length == 0) { delete news.type }
        return news;
    }

    async findById(id) {
        return await this.News.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findByUserId(UserID) {
        const cursor = await this.News.aggregate([
            { $match:{
                $and:[
                    { _receiveUid: UserID.toString() },
                    {confirm: false }
                ]
            } },
            { $sort: { date_created: 1 } }
        ]);
        return await cursor.toArray();
    }

    async create(payload) {
        const news = this.extractNewsData(payload);
        const result = await this.News.findOneAndUpdate(
            news,
            {
                $set: {
                    readed: false,
                    confirm: false,
                    date_created: new Date().getTime(),
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
        const update = this.extractNewsData(payload);
        const result = await this.News.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.News.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = NewsService;