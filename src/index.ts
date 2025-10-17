import "dotenv/config";
import Fastify from "fastify";
import connectDb from "./db/db";
import registerRoutes from "./registerRoutes";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import cron from "node-cron";
import { getAllUsers, userDetails } from "./modules/user/user.service";
import { getGeminiResponse } from "./config/gemini";
import { createMail } from "./modules/mail/mail.service";

const server = Fastify();

const port: number = parseInt(process.env.PORT || "4000");

server.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

server.register(fastifyCookie);
registerRoutes(server);
connectDb()
  .then(() => console.log("DB connected"))
  .catch((e) => console.error("error with db connection", e));


 cron.schedule("*/3 * * * *", async () => {
  console.log("📬 Cron: Generating and sending mails...");

  try {
    const users = await getAllUsers();
    for (const user of users.data) {
      const user1 = await userDetails(user._id);
      const userJson = JSON.stringify(user1.data);
      const geminiResponse = await getGeminiResponse(
        "give the details of users expenses and suggest something to manage money",
        userJson
      );
      const mail = await createMail(user._id, geminiResponse);
      console.log(`✅ Mail sent to ${user.email}: ${mail.message}`);
    }
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
}); 
server
  .listen({ port, host: "0.0.0.0" })
  .then(() => console.log(`🚀 Server running on port ${port}`))
  .catch((e) => console.error("❌ Error listening to server", e));
