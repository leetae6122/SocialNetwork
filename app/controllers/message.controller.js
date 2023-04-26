const MessageService = require("../services/message.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    try {
        const messageService = new MessageService(MongoDB.client);
        const document = await messageService.findById(req.params.conversationId);
        if (!document) {
            return next(new ApiError(404, "Message not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving message with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    try {
        const messageService = new MessageService(MongoDB.client);
        const document = await messageService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the message")
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const messageService = new MessageService(MongoDB.client);
        const document = await messageService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Message not found"));
        }
        return res.send({ message: "Message was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete message with id=${req.params.id}`)
        );
    }
};