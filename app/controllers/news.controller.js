const NewsService = require("../services/news.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findUserAll = async (req, res, next) => {
    let documents = [];
    try {
        const newsService = new NewsService(MongoDB.client);
        documents = await newsService.findByUserId(req.user._id);
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the news")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "News not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving news with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    try {
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the news")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(ApiError(400, "Data to update can not be empty"));
    }
    try {
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.update(req.params.id, req.body);
        if (!document) {
            return new (ApiError(404, "News not found"))
        }
        return res.send({ message: "News was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update news with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "News not found"));
        }
        return res.send({ message: "News was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete news with id=${req.params.id}`)
        );
    }
};