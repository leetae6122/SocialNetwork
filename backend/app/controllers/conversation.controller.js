const ConversationService = require("../services/conversation.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findOne = async (req, res, next) => {
    try {
        const conversationService = new ConversationService(MongoDB.client);
        let document = await conversationService.findOneByUserId(req.user._id,req.params.userId);
        if (!document) {
            document = await conversationService.create({members:[req.user._id, req.params.userId]});
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving conversation with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    try {
        const conversationService = new ConversationService(MongoDB.client);
        const document = await conversationService.create({members:[req.body.senderId,req.body.receiverId]});
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the conversation")
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const conversationService = new ConversationService(MongoDB.client);
        const document = await conversationService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Conversation not found"));
        }
        return res.send({ message: "Conversation was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete conversation with id=${req.params.id}`)
        );
    }
};