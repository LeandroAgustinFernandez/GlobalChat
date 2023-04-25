import express from "express";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
  console.log(`Server listening at port 8080 - http://localhost:8080/`);
});

const io = new Server(httpServer);

let messages = [];

io.on("connection", (socket) => {
  console.log(`New user online...`);

  socket.on("newuser", ({ user }) => {
    io.emit("messageLogs", messages);
    socket.broadcast.emit("newuserconnected", { user: user });
  });

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });
});
