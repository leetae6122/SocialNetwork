const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

//Start Server
async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        const time = new Date();
        console.log(`Connect to the database! ${config.db.uri}`);
        console.log(`Time: ${time}`)
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
            console.log('------------------------------------------------------------------');
        });
    }catch (error) {
        console.log("Cannot connect to the database!",error);
        process.exit();
    }
}

startServer();