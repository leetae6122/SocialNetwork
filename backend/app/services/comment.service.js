const { ObjectId } = require("mongodb");

class CommentService {
    constructor(client) {
        this.Comment = client.db().collection("comments");
    }
    extractPostData(payload) {
        const comment = {
            text: payload.text,
            img: payload.img,
        };
        Object.keys(comment).forEach(
            (key) => comment[key] === undefined && delete comment[key]
        );
        return comment;
    }

    async create(UserID, PostID, payload) {
        const comment = this.extractPostData(payload);

        const result = await this.Comment.findOneAndUpdate(
            comment,
            {
                $set: {
                    _pid: PostID,
                    _uid: UserID,
                    date_created: new Date()
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async dynamicSort(property) {
        return (a,b) => {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result ;
        }
    }
}

module.exports = CommentService;