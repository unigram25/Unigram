const express = require("express");
const res = require("express/lib/response");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");
const { userRouter } = require("./routes/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(port, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });