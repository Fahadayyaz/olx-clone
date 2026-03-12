require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const connectDB = require("./config/db");
const passport = require("./config/passport");

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
});
app.set("io", io);

// DB
connectDB();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Stripe webhook needs raw body — must come before express.json()
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/chats", require("./routes/chatRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// Health check
app.get("/", (req, res) => res.json({ message: "OLX Clone API running" }));

// Socket.io handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("typing", ({ chatId, userName }) => {
    socket.to(chatId).emit("userTyping", { userName });
  });

  socket.on("stopTyping", ({ chatId }) => {
    socket.to(chatId).emit("userStopTyping");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Cron: un-feature expired ads (runs every hour in production)
const Ad = require("./models/Ad");
setInterval(
  async () => {
    try {
      await Ad.updateMany(
        { isFeatured: true, featuredUntil: { $lt: new Date() } },
        { isFeatured: false, featuredUntil: null },
      );
    } catch (err) {
      console.error("Featured cleanup error:", err);
    }
  },
  60 * 60 * 1000,
);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
