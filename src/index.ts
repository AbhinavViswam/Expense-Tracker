import "dotenv/config";
import Fastify from "fastify";
import connectDb from "./db/db";
import registerRoutes from "./registerRoutes";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";

const server = Fastify();

const port: number = parseInt(process.env.PORT || "4000");

server.register(fastifyCookie);
server.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

registerRoutes(server);
connectDb()
  .then(() => console.log("DB connected"))
  .catch((e) => console.error("error with db connection", e));

server
  .listen({ port, host: "0.0.0.0" })
  .then(() => console.log(`🚀 Server running on port ${port}`))
  .catch((e) => console.error("❌ Error listening to server", e));
