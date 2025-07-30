import "dotenv/config";
import Fastify from "fastify"
import connectDb from "./db/db";

const server = Fastify();

const port: number = parseInt(process.env.PORT || "3000");

connectDb()
  .then(() => console.log("DB connected"))
  .catch((e) => console.error("error with db connection", e));

server
  .listen({ port: port })
  .then(() => console.log(`server running on port ${port}`))
  .catch((e) => console.error("Error listening to server", e));
