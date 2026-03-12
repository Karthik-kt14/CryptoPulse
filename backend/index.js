// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import connectDb from "./config/connectionDb.js";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// app.use(cors({
//   origin: "https://crypto-pulse-8dtn.onrender.com",
//   credentials: true
// }));

// app.use(express.json());
// app.use("/api", authRoutes);

// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// const resolvedPath = path.resolve(__dirname, "../frontend/dist/index.html");

// app.get("*", (req, res) => {
//   res.sendFile(resolvedPath);
// });

// connectDb().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// });
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// import connectDb from "./config/connectionDb.js";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// /* Fix for __dirname in ES modules */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// /* =========================
//    CORS CONFIGURATION
// ========================= */

// // app.use(cors({
// //   origin: [
// //     "http://localhost:5173",
// //     "https://crypto-pulse-8dtn.onrender.com"
// //   ],
// //   credentials: true
// // }));
// import cors from "cors";

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
// /* =========================
//    MIDDLEWARE
// ========================= */

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /* =========================
//    API ROUTES
// ========================= */

// app.use("/api", authRoutes);

// /* =========================
//    SERVE FRONTEND (PRODUCTION)
// ========================= */

// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
// });

// /* =========================
//    CONNECT DB + START SERVER
// ========================= */

// connectDb()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("❌ Database connection failed:", err);
//   });



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import connectDb from "./config/connectionDb.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* Fix __dirname for ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* =========================
   CORS CONFIGURATION
========================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   API ROUTES
========================= */

app.use("/api", authRoutes);

/* =========================
   SERVE FRONTEND (PRODUCTION)
========================= */

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

/* =========================
   CONNECT DB + START SERVER
========================= */

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Database connection failed:", err);
  });