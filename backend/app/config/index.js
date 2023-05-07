const config = { 
    app: { 
        port: process.env.PORT || 3000, 
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialnetwork"
    },
    JWT_Secret:process.env.JWT_Secret,
};

module.exports = config;
