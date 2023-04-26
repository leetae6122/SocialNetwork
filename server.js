const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

//Start Server
async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log(`Connect to the database! ${config.db.uri}`);
        const PORT = config.app.port;
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
            console.log('------------------------------------------------------------------');
        });
        const io = require("socket.io")(server, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"]
            }
        });
        io.on('connection', (socket) => {
            console.log('a user connected', socket.id);
            socket.on("room", (data) => {
                socket.join(data);
                console.log("room",data);
            });

            socket.on("send", (data) => {
                socket.to(data.room).emit('receive',{
                    msg: data.msg,
                    room: data.room
                })
            });

            socket.on("disconnect",()=>{
                console.log("a user disconnected!");
            })
        });
    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();