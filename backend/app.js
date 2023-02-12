require ('dotenv').config()

const express = require("express");
const cors = require("cors");
const usersRouter = require("./app/routes/user.route");
const authRouter = require("./app/routes/auth.route");
const auth = require("./app/middlewares/auth");
const ApiError = require("./app/api-error");

const app = express();
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application." });
});

app.use("/api/users",auth.verifyToken ,usersRouter);
app.use("/api/auth", authRouter);

// handle 404 response 
app.use((req, res, next) => {
    // Code ở đây sẽ chạy khi không có route được định nghĩa nào    
    //    khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi    
    return next(new ApiError(404, "Resource not found"));
});

//define error-handling middleware last, after other app.use() and routes calls 
app.use((error, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    //      sẽ chuyển về middleware xử lý lỗi này
    return res.status(error.statusCode || 500).json({ 
        message: error.message || "Internal Server Error", 
    });
});

module.exports = app;
