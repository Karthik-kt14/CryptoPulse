// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const User = require('../models/User');

// const {signUp,login,sendOTP,verifyOTP,googleSignIn} = require('../controller/authController');
  
//   router.post('/signup', signUp);
//   router.post('/login', login);
//   router.post('/forgot-password', sendOTP);
//   router.post('/verify-otp', verifyOTP);
//   router.post('/google', googleSignIn);
  
//   const authenticateUser = async (req, res, next) => {
//     try {
//       const authHeader = req.headers.authorization;
//       if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
//       const token = authHeader.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
//       const user = await User.findById(decoded.id);
//       if (!user) return res.status(404).json({ message: "User not found" });
  
//       req.user = user;
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: "Unauthorized", error: err.message });
//     }
//   };
  
//   router.get("/cryptos",authenticateUser, async (req, res) => {
//     //res.send("Crypto route works");
//     try {
//       const user = await User.findById(req.user.id);
//       if (!user) return res.status(404).json({ message: "User not found" });
//       const symbols = user.cryptos;
//       const ids = symbols.join(',');
//       const response = await axios.get(
//           `https://api.coingecko.com/api/v3/coins/markets`,
//           {
//               params: {
//                   vs_currency: 'usd',
//                   ids: ids,
//                   price_change_percentage: '1h,24h,7d',
//               }
//           }
//       );
//       const data = response.data.map((coin) => ({
//           id: coin.id,
//           name: coin.name,
//           symbol: coin.symbol,
//           image: coin.image,
//           current_price: coin.current_price,
//           price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
//           price_change_percentage_24h: coin.price_change_percentage_24h,
//           price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
//       }));
//       res.json(data);
//   } catch (err) {
//       console.error("Error fetching crypto data:", err.message);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
  
//   // router.post("/cryptos/add", authenticateUser, async (req, res) => {
//   //   try {
//   //     const { symbol } = req.body;
//   //     const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol}`);
//   //     req.user.cryptos.push(symbol);
//   //     await req.user.save();
//   //     res.json({ message: "Cryptocurrency added successfully" });
//   //   }catch(err){
//   //     if(err.response?.status === 404){
//   //       res.status(400).json({ error: "Cryptocurrency not found. Please check the symbol." });
//   //     }
//   //     else{
//   //       console.error("Error adding crypto:", err);
//   //       res.status(500).json({ error: "Failed to add cryptocurrency" });
//   //     }
//   //   }
//   // });

//   router.post("/crypto/add", authenticateUser, async (req, res) => {
//     try {
//       const { symbol } = req.body;
//       if (!symbol || typeof symbol !== 'string') {
//         return res.status(400).json({ message: "Valid symbol is required" });
//       }
//       const coinId = symbol.toLowerCase();
//       let coinDetails;
//       try {
//         const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
//           params: {
//             vs_currency: 'usd',
//             ids: coinId,
//           }
//         });
//         if (!response.data || response.data.length === 0) {
//           return res.status(404).json({
//             message: `Coin with ID "${symbol}" not found.`,
//             suggestions: [
//               'Use the official CoinGecko ID like "bitcoin", "solana", "usd-coin"',
//               'Use the popup search to find the correct ID'
//             ]
//           });
//         }
//         coinDetails = response.data[0];
//       } catch (err) {
//         console.error("Coin fetch failed:", err.message);
//         return res.status(500).json({
//           message: "Failed to fetch coin details",
//           error: err.message,
//           details: process.env.NODE_ENV === 'development' ? err.stack : undefined
//         });
//       }
//       if (!req.user.cryptos.includes(coinDetails.id)) {
//         req.user.cryptos.push(coinDetails.id);
//         await req.user.save();
//       }
//       res.json({
//         success: true,
//         message: `Added ${coinDetails.name} (${coinDetails.symbol.toUpperCase()})`,
//         data: {
//           id: coinDetails.id,
//           symbol: coinDetails.symbol,
//           name: coinDetails.name
//         }
//       });
  
//     } catch (err) {
//       console.error("Add error:", err);
//       res.status(500).json({
//         message: "Failed to add cryptocurrency",
//         error: err.message,
//         details: process.env.NODE_ENV === 'development' ? err.stack : undefined
//       });
//     }
//   });
  

//   router.get("/crypto/search", authenticateUser, async (req, res) => {
//     try {
//       const query = req.query.query?.toLowerCase() || "";
//       if (!query) return res.json([]);
//       const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`);
//       const result = response.data.coins.map((coin) => ({
//         id: coin.id,
//         name: coin.name,
//         symbol: coin.symbol
//       }));
//       res.json(result.slice(0, 10));
//     } catch (err) {
//       console.error("Search failed:", err);
//       res.status(500).json({ 
//         message: "Search failed", 
//         error: err.message 
//       });
//     }
//   });

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {
//   try {
//     const { symbol } = req.params;
//     // console.log(`Delete request for symbol: ${symbol}`);
//     // console.log(`User's current cryptos:`, req.user.cryptos);
//     const index = req.user.cryptos.findIndex(
//       (coin) => coin.toLowerCase() === symbol.toLowerCase()
//     );
//     if (index === -1) {
//       console.log('Symbol not found in user list');
//       return res.status(404).json({ 
//         success: false,
//         message: `"${symbol}" not found in your portfolio.`,
//         yourCoins: req.user.cryptos,
//         suggestion: `Try using the exact symbol from your list.`
//       });
//     }
//     req.user.cryptos.splice(index, 1);
//     req.user.markModified("cryptos");
//     await req.user.save();
//     res.status(200).json({
//       success: true,
//       message: `${symbol} removed successfully.`,
//       remainingCoins: req.user.cryptos
//     });
    
//   } catch (err) {
//     console.error('Delete error:', err);
//     res.status(500).json({
//       success: false,
//       message: "Server error during deletion",
//       error: err.message
//     });
//   }
// });
  
//   module.exports = router;
  

// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn,
// } = require("../controller/authController");

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* =========================
//    AUTH MIDDLEWARE
// ========================= */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader)
//       return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     req.user = user;

//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Unauthorized",
//       error: err.message,
//     });
//   }
// };

// /* =========================
//    GET USER CRYPTOS
// ========================= */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {
//     const symbols = req.user.cryptos;

//     if (!symbols.length) return res.json([]);

//     const ids = symbols.join(",");

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids,
//           price_change_percentage: "1h,24h,7d",
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (err) {
//     console.error("Crypto fetch error:", err.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /* =========================
//    ADD CRYPTO
// ========================= */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     const { symbol } = req.body;

//     if (!symbol)
//       return res.status(400).json({ message: "Symbol is required" });

//     const coinId = symbol.toLowerCase();

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids: coinId,
//         },
//       }
//     );

//     if (!response.data.length) {
//       return res.status(404).json({
//         message: `Coin ${symbol} not found`,
//       });
//     }

//     if (!req.user.cryptos.includes(coinId)) {
//       req.user.cryptos.push(coinId);
//       await req.user.save();
//     }

//     res.json({
//       success: true,
//       message: "Crypto added",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to add crypto" });
//   }
// });

// /* =========================
//    SEARCH CRYPTO
// ========================= */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     const query = req.query.query || "";

//     if (!query) return res.json([]);

//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/search?query=${query}`
//     );

//     const coins = response.data.coins.map((coin) => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//     }));

//     res.json(coins.slice(0, 10));
//   } catch (err) {
//     console.error("Search error:", err.message);
//     res.status(500).json({ message: "Search failed" });
//   }
// });

// /* =========================
//    DELETE CRYPTO
// ========================= */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {
//   try {
//     const { symbol } = req.params;

//     const index = req.user.cryptos.findIndex(
//       (coin) => coin.toLowerCase() === symbol.toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not found in portfolio`,
//       });
//     }

//     req.user.cryptos.splice(index, 1);

//     await req.user.save();

//     res.json({
//       success: true,
//       message: `${symbol} removed`,
//     });
//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({ message: "Delete failed" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);


// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;

//     next();

//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };


// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {

//     const ids = req.user.cryptos.join(",");

//     if (!ids) return res.json([]);

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids
//         }
//       }
//     );

//     res.json(response.data);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch cryptos" });
//   }
// });

// module.exports = router;


// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// /* ======================
//    AUTH ROUTES
// ====================== */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);


// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;

//     next();

//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };


// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {

//     const ids = req.user.cryptos.join(",");

//     if (!ids) return res.json([]);

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids
//         }
//       }
//     );

//     res.json(response.data);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch cryptos" });
//   }
// });


// /* ======================
//    ADD CRYPTO
// ====================== */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {

//     const { symbol } = req.body;

//     if (!symbol) {
//       return res.status(400).json({ message: "Symbol required" });
//     }

//     const coinId = symbol.toLowerCase();

//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/coins/${coinId}`
//     );

//     if (!response.data) {
//       return res.status(404).json({ message: `${symbol} not found` });
//     }

//     if (!req.user.cryptos.includes(coinId)) {
//       req.user.cryptos.push(coinId);
//       await req.user.save();
//     }

//     res.json({
//       success: true,
//       message: `${coinId} added`
//     });

//   } catch (err) {
//     console.error(err.message);
//     res.status(404).json({ message: `${req.body.symbol} not found` });
//   }
// });


// /* ======================
//    SEARCH CRYPTO
// ====================== */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {

//     const query = req.query.query || "";

//     if (!query) return res.json([]);

//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/search?query=${query}`
//     );

//     const coins = response.data.coins.map((coin) => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol
//     }));

//     res.json(coins.slice(0, 10));

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Search failed" });
//   }
// });


// /* ======================
//    DELETE CRYPTO
// ====================== */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {
//   try {

//     const { symbol } = req.params;

//     const index = req.user.cryptos.findIndex(
//       (coin) => coin.toLowerCase() === symbol.toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);

//     await req.user.save();

//     res.json({
//       success: true,
//       message: `${symbol} removed`
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Delete failed" });
//   }
// });


// module.exports = router;



// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// /* ======================
//    AUTH ROUTES
// ====================== */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);


// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {

//     const authHeader = req.headers.authorization;

//     if (!authHeader)
//       return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     req.user = user;

//     next();

//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };


// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {

//     const ids = req.user.cryptos.join(",");

//     if (!ids) return res.json([]);

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids: ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     res.json(response.data);

//   } catch (err) {

//     console.error("Crypto fetch error:", err.message);

//     res.status(500).json({
//       message: "Failed to fetch cryptos"
//     });

//   }
// });


// /* ======================
//    ADD CRYPTO (FIXED)
// ====================== */

// router.post("/crypto/add", authenticateUser, async (req, res) => {

//   try {

//     const { symbol } = req.body;

//     if (!symbol)
//       return res.status(400).json({ message: "Symbol required" });

//     const coinId = symbol.toLowerCase();

//     // Verify coin exists using markets API
//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids: coinId
//         }
//       }
//     );

//     if (!response.data.length) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     // Add coin if not already present
//     if (!req.user.cryptos.includes(coinId)) {

//       req.user.cryptos.push(coinId);

//       await req.user.save();

//     }

//     res.json({
//       success: true,
//       message: `${coinId} added`
//     });

//   } catch (err) {

//     console.error("Add crypto error:", err.message);

//     res.status(500).json({
//       message: "Failed to add crypto"
//     });

//   }

// });


// /* ======================
//    SEARCH CRYPTO
// ====================== */

// router.get("/crypto/search", authenticateUser, async (req, res) => {

//   try {

//     const query = req.query.query || "";

//     if (!query) return res.json([]);

//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/search?query=${query}`
//     );

//     const coins = response.data.coins.map((coin) => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol
//     }));

//     res.json(coins.slice(0, 10));

//   } catch (err) {

//     console.error("Search error:", err.message);

//     res.status(500).json({
//       message: "Search failed"
//     });

//   }

// });


// /* ======================
//    DELETE CRYPTO
// ====================== */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {

//   try {

//     const { symbol } = req.params;

//     const index = req.user.cryptos.findIndex(
//       (coin) => coin.toLowerCase() === symbol.toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);

//     await req.user.save();

//     res.json({
//       success: true,
//       message: `${symbol} removed`
//     });

//   } catch (err) {

//     console.error("Delete error:", err.message);

//     res.status(500).json({
//       message: "Delete failed"
//     });

//   }

// });


// module.exports = router;











// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// /* ======================
//    AUTH ROUTES
// ====================== */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);


// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {

//     const authHeader = req.headers.authorization;

//     if (!authHeader)
//       return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user)
//       return res.status(404).json({ message: "User not found" });

//     req.user = user;

//     next();

//   } catch (err) {

//     console.error("Auth error:", err.message);

//     res.status(401).json({ message: "Unauthorized" });

//   }
// };


// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// // router.get("/cryptos", authenticateUser, async (req, res) => {

// //   try {

// //     if (!req.user.cryptos || req.user.cryptos.length === 0)
// //       return res.json([]);

// //     const ids = req.user.cryptos.join(",");

// //     const response = await axios.get(
// //       "https://api.coingecko.com/api/v3/coins/markets",
// //       {
// //         params: {
// //           vs_currency: "usd",
// //           ids: ids,
// //           price_change_percentage: "1h,24h,7d"
// //         }
// //       }
// //     );

// //     res.json(response.data);

// //   } catch (err) {

// //     console.error("Crypto fetch error:", err.message);

// //     res.status(500).json({
// //       message: "Failed to fetch cryptos"
// //     });

// //   }

// // });


// // /* ======================
// //    ADD CRYPTO
// // ====================== */

// // router.post("/crypto/add", authenticateUser, async (req, res) => {

// //   try {

// //     const { symbol } = req.body;

// //     if (!symbol)
// //       return res.status(400).json({ message: "Symbol required" });

// //     const coinId = symbol.toLowerCase();

// //     /* verify coin exists */
// //     const response = await axios.get(
// //       "https://api.coingecko.com/api/v3/coins/markets",
// //       {
// //         params: {
// //           vs_currency: "usd",
// //           ids: coinId
// //         }
// //       }
// //     );

// //     if (!response.data || response.data.length === 0) {
// //       return res.status(404).json({
// //         message: `"${coinId}" not found`
// //       });
// //     }

// //     /* initialize array if undefined */
// //     if (!req.user.cryptos)
// //       req.user.cryptos = [];

// //     /* prevent duplicates */
// //     if (req.user.cryptos.includes(coinId)) {
// //       return res.json({
// //         success: true,
// //         message: "Already added"
// //       });
// //     }

// //     req.user.cryptos.push(coinId);

// //     await req.user.save();

// //     res.json({
// //       success: true,
// //       message: `${coinId} added`
// //     });

// //   } catch (err) {

// //     console.error("Add crypto error:", err.message);

// //     res.status(500).json({
// //       message: "Failed to add crypto"
// //     });

// //   }

// // });
// //add crypto
// router.post("/crypto/add", authenticateUser, async (req, res) => {

//   try {

//     const { symbol } = req.body;

//     if (!symbol)
//       return res.status(400).json({ message: "Symbol required" });

//     const coinId = symbol.toLowerCase();

//     /* verify using search API */
//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/search?query=${coinId}`
//     );

//     const coinExists = response.data.coins.find(
//       (coin) => coin.id === coinId
//     );

//     if (!coinExists) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     if (!req.user.cryptos)
//       req.user.cryptos = [];

//     if (req.user.cryptos.includes(coinId)) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     req.user.cryptos.push(coinId);

//     await req.user.save();

//     res.json({
//       success: true,
//       message: `${coinId} added`
//     });

//   } catch (err) {

//     console.error("Add crypto error:", err.message);

//     res.status(500).json({
//       message: "Failed to add crypto"
//     });

//   }

// });   


// //fetch user
// // router.get("/cryptos", authenticateUser, async (req, res) => {

// //   try {

// //     if (!req.user.cryptos || req.user.cryptos.length === 0)
// //       return res.json([]);

// //     const ids = req.user.cryptos.join(",");

// //     const response = await axios.get(
// //       "https://api.coingecko.com/api/v3/coins/markets",
// //       {
// //         params: {
// //           vs_currency: "usd",
// //           ids: ids,
// //           price_change_percentage: "1h,24h,7d"
// //         }
// //       }
// //     );

// //     const data = response.data || [];

// //     res.json(data);

// //   } catch (err) {

// //     console.error("Crypto fetch error:", err.response?.data || err.message);

// //     res.json([]);   // IMPORTANT: never crash dashboard

// //   }

// // });
// router.get("/cryptos", authenticateUser, async (req, res) => {

//   try {

//     if (!req.user.cryptos || req.user.cryptos.length === 0)
//       return res.json([]);

//     // Clean ids before sending to CoinGecko
//     const ids = req.user.cryptos
//       .map(c => c.toLowerCase().trim())
//       .join(",");

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids: ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     res.json(response.data || []);

//   } catch (err) {

//     console.error("Fetch cryptos error:", err.message);

//     res.json([]);

//   }

// });
// /* ======================
//    SEARCH CRYPTO
// ====================== */

// router.get("/crypto/search", authenticateUser, async (req, res) => {

//   try {

//     const query = req.query.query || "";

//     if (!query) return res.json([]);

//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/search?query=${query}`
//     );

//     const coins = response.data.coins.map((coin) => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol
//     }));

//     res.json(coins.slice(0, 10));

//   } catch (err) {

//     console.error("Search error:", err.message);

//     res.status(500).json({
//       message: "Search failed"
//     });

//   }

// });


// /* ======================
//    DELETE CRYPTO
// ====================== */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {

//   try {

//     const { symbol } = req.params;

//     if (!req.user.cryptos)
//       req.user.cryptos = [];

//     const index = req.user.cryptos.findIndex(
//       (coin) => coin.toLowerCase() === symbol.toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);

//     await req.user.save();

//     res.json({
//       success: true,
//       message: `${symbol} removed`
//     });

//   } catch (err) {

//     console.error("Delete error:", err.message);

//     res.status(500).json({
//       message: "Delete failed"
//     });

//   }

// });


// module.exports = router;






// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// /* ======================
//    AUTH ROUTES
// ====================== */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {
//     if (!req.user.cryptos || req.user.cryptos.length === 0) {
//       return res.json([]);
//     }

//     const ids = req.user.cryptos
//       .map((c) => String(c).toLowerCase().trim())
//       .filter(Boolean)
//       .join(",");

//     if (!ids) {
//       return res.json([]);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     return res.json(Array.isArray(response.data) ? response.data : []);
//   } catch (err) {
//     console.error("Fetch cryptos error:", err.response?.data || err.message);
//     return res.json([]);
//   }
// });

// /* ======================
//    SEARCH CRYPTO
// ====================== */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     const query = (req.query.query || "").trim();

//     if (!query) {
//       return res.json([]);
//     }

//     if (query.length < 2) {
//       return res.json([]);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins)
//       ? response.data.coins.map((coin) => ({
//           id: coin.id,
//           name: coin.name,
//           symbol: coin.symbol
//         }))
//       : [];

//     return res.json(coins.slice(0, 10));
//   } catch (err) {
//     console.error("Search error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Too many search requests. Please try again."
//       });
//     }

//     return res.json([]);
//   }
// });

// /* ======================
//    ADD CRYPTO
// ====================== */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     const { symbol } = req.body;

//     if (!symbol || !String(symbol).trim()) {
//       return res.status(400).json({ message: "Symbol required" });
//     }

//     const coinId = String(symbol).toLowerCase().trim();

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query: coinId }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins) ? response.data.coins : [];

//     const coinExists = coins.find(
//       (coin) => coin.id.toLowerCase() === coinId
//     );

//     if (!coinExists) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     if (!req.user.cryptos) {
//       req.user.cryptos = [];
//     }

//     const alreadyAdded = req.user.cryptos.some(
//       (c) => String(c).toLowerCase() === coinId
//     );

//     if (alreadyAdded) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     req.user.cryptos.push(coinId);
//     await req.user.save();

//     return res.json({
//       success: true,
//       message: `${coinId} added`
//     });
//   } catch (err) {
//     console.error("Add crypto error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Rate limit reached. Please try again in a moment."
//       });
//     }

//     return res.status(500).json({
//       message: "Failed to add crypto"
//     });
//   }
// });

// /* ======================
//    DELETE CRYPTO
// ====================== */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {
//   try {
//     const { symbol } = req.params;

//     if (!req.user.cryptos) {
//       req.user.cryptos = [];
//     }

//     const index = req.user.cryptos.findIndex(
//       (coin) => String(coin).toLowerCase() === String(symbol).toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);
//     await req.user.save();

//     return res.json({
//       success: true,
//       message: `${symbol} removed`
//     });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Delete failed"
//     });
//   }
// });

// module.exports = router;




// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// const searchCache = new Map();

// const setNoCache = (res) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
// };

// /* ======================
//    AUTH ROUTES
// ====================== */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     if (!req.user.cryptos || req.user.cryptos.length === 0) {
//       return res.json([]);
//     }

//     const ids = req.user.cryptos
//       .map((c) => String(c).toLowerCase().trim())
//       .filter(Boolean)
//       .join(",");

//     if (!ids) {
//       return res.json([]);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     return res.json(Array.isArray(response.data) ? response.data : []);
//   } catch (err) {
//     console.error("Fetch cryptos error:", err.response?.data || err.message);
//     return res.json([]);
//   }
// });

// /* ======================
//    SEARCH CRYPTO
// ====================== */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const query = (req.query.query || "").trim().toLowerCase();

//     if (!query || query.length < 3) {
//       return res.json([]);
//     }

//     const cached = searchCache.get(query);
//     if (cached && Date.now() - cached.time < 30000) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins)
//       ? response.data.coins.map((coin) => ({
//           id: coin.id,
//           name: coin.name,
//           symbol: coin.symbol
//         }))
//       : [];

//     const result = coins.slice(0, 10);

//     searchCache.set(query, {
//       data: result,
//       time: Date.now()
//     });

//     return res.json(result);
//   } catch (err) {
//     console.error("Search error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "CoinGecko rate limit reached. Please wait a few seconds."
//       });
//     }

//     return res.json([]);
//   }
// });

// /* ======================
//    ADD CRYPTO
// ====================== */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const { symbol } = req.body;

//     if (!symbol || !String(symbol).trim()) {
//       return res.status(400).json({ message: "Symbol required" });
//     }

//     const coinId = String(symbol).toLowerCase().trim();

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query: coinId }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins) ? response.data.coins : [];

//     const coinExists = coins.find(
//       (coin) => coin.id.toLowerCase() === coinId
//     );

//     if (!coinExists) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     if (!req.user.cryptos) {
//       req.user.cryptos = [];
//     }

//     const alreadyAdded = req.user.cryptos.some(
//       (c) => String(c).toLowerCase() === coinId
//     );

//     if (alreadyAdded) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     req.user.cryptos.push(coinId);
//     await req.user.save();

//     return res.json({
//       success: true,
//       message: `${coinId} added`
//     });
//   } catch (err) {
//     console.error("Add crypto error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Rate limit reached. Please try again in a moment."
//       });
//     }

//     return res.status(500).json({
//       message: "Failed to add crypto"
//     });
//   }
// });

// /* ======================
//    DELETE CRYPTO
// ====================== */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const { symbol } = req.params;

//     if (!req.user.cryptos) {
//       req.user.cryptos = [];
//     }

//     const index = req.user.cryptos.findIndex(
//       (coin) => String(coin).toLowerCase() === String(symbol).toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);
//     await req.user.save();

//     return res.json({
//       success: true,
//       message: `${symbol} removed`
//     });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Delete failed"
//     });
//   }
// });

// module.exports = router;



// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// const searchCache = new Map();

// const setNoCache = (res) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
// };

// /* ======================
//    AUTH ROUTES
// ====================== */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// // router.get("/cryptos", authenticateUser, async (req, res) => {
// //   try {
// //     setNoCache(res);

// //     if (!req.user.cryptos || req.user.cryptos.length === 0) {
// //       return res.json([]);
// //     }

// //     const ids = req.user.cryptos
// //       .map((c) => String(c).toLowerCase().trim())
// //       .filter(Boolean)
// //       .join(",");

// //     if (!ids) {
// //       return res.json([]);
// //     }

// //     const response = await axios.get(
// //       "https://api.coingecko.com/api/v3/coins/markets",
// //       {
// //         params: {
// //           vs_currency: "usd",
// //           ids,
// //           price_change_percentage: "1h,24h,7d"
// //         }
// //       }
// //     );

// //     return res.json(Array.isArray(response.data) ? response.data : []);
// //   } catch (err) {
// //     console.error("Fetch cryptos error:", err.response?.data || err.message);
// //     return res.json([]);
// //   }
// // });

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     console.log("User cryptos from DB:", req.user.cryptos);

//     if (!req.user.cryptos || req.user.cryptos.length === 0) {
//       return res.json([]);
//     }

//     const ids = req.user.cryptos
//       .map((c) => String(c).toLowerCase().trim())
//       .filter(Boolean)
//       .join(",");

//     console.log("Requesting CoinGecko for:", ids);

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids: ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     console.log("CoinGecko response:", response.data);

//     if (!Array.isArray(response.data) || response.data.length === 0) {
//       return res.json([]);
//     }

//     res.json(response.data);
//   } catch (err) {
//     console.error("Fetch cryptos error:", err.response?.data || err.message);
//     res.json([]);
//   }
// });

// /* ======================
//    SEARCH CRYPTO
// ====================== */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const query = (req.query.query || "").trim().toLowerCase();

//     if (!query || query.length < 3) {
//       return res.json([]);
//     }

//     const cached = searchCache.get(query);
//     if (cached && Date.now() - cached.time < 30000) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins)
//       ? response.data.coins.map((coin) => ({
//           id: coin.id,
//           name: coin.name,
//           symbol: coin.symbol
//         }))
//       : [];

//     const result = coins.slice(0, 10);

//     searchCache.set(query, {
//       data: result,
//       time: Date.now()
//     });

//     return res.json(result);
//   } catch (err) {
//     console.error("Search error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "CoinGecko rate limit reached. Please wait a few seconds."
//       });
//     }

//     return res.json([]);
//   }
// });

// /* ======================
//    ADD CRYPTO
// ====================== */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const { symbol } = req.body;

//     if (!symbol || !String(symbol).trim()) {
//       return res.status(400).json({ message: "Symbol required" });
//     }

//     const coinId = String(symbol).toLowerCase().trim();

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query: coinId }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins) ? response.data.coins : [];

//     const coinExists = coins.find(
//       (coin) => coin.id.toLowerCase() === coinId
//     );

//     if (!coinExists) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     if (!req.user.cryptos) {
//       req.user.cryptos = [];
//     }

//     const alreadyAdded = req.user.cryptos.some(
//       (c) => String(c).toLowerCase() === coinId
//     );

//     if (alreadyAdded) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     req.user.cryptos.push(coinId);
//     await req.user.save();

//     return res.json({
//       success: true,
//       message: `${coinId} added`
//     });
//   } catch (err) {
//     console.error("Add crypto error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Rate limit reached. Please try again in a moment."
//       });
//     }

//     return res.status(500).json({
//       message: "Failed to add crypto"
//     });
//   }
// });

// /* ======================
//    DELETE CRYPTO
// ====================== */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const { symbol } = req.params;

//     if (!req.user.cryptos) {
//       req.user.cryptos = [];
//     }

//     const index = req.user.cryptos.findIndex(
//       (coin) => String(coin).toLowerCase() === String(symbol).toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);
//     await req.user.save();

//     return res.json({
//       success: true,
//       message: `${symbol} removed`
//     });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Delete failed"
//     });
//   }
// });

// module.exports = router;






// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// const searchCache = new Map();

// const setNoCache = (res) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
// };

// /* ======================
//    AUTH ROUTES
// ====================== */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* ======================
//    AUTH MIDDLEWARE
// ====================== */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// /* ======================
//    FETCH USER CRYPTOS
// ====================== */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     // Always fetch fresh user from DB
//     const freshUser = await User.findById(req.user._id).lean();

//     console.log("Fresh user cryptos from DB:", freshUser?.cryptos);

//     if (!freshUser || !Array.isArray(freshUser.cryptos) || freshUser.cryptos.length === 0) {
//       return res.json([]);
//     }

//     const ids = freshUser.cryptos
//       .map((c) => String(c).toLowerCase().trim())
//       .filter(Boolean)
//       .join(",");

//     console.log("Requesting CoinGecko for:", ids);

//     if (!ids) {
//       return res.json([]);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     console.log("CoinGecko response:", response.data);

//     return res.json(Array.isArray(response.data) ? response.data : []);
//   } catch (err) {
//     console.error("Fetch cryptos error:", err.response?.data || err.message);
//     return res.json([]);
//   }
// });

// /* ======================
//    SEARCH CRYPTO
// ====================== */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const query = (req.query.query || "").trim().toLowerCase();

//     if (!query || query.length < 3) {
//       return res.json([]);
//     }

//     const cached = searchCache.get(query);
//     if (cached && Date.now() - cached.time < 30000) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins)
//       ? response.data.coins.map((coin) => ({
//           id: coin.id,
//           name: coin.name,
//           symbol: coin.symbol
//         }))
//       : [];

//     const result = coins.slice(0, 10);

//     searchCache.set(query, {
//       data: result,
//       time: Date.now()
//     });

//     return res.json(result);
//   } catch (err) {
//     console.error("Search error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "CoinGecko rate limit reached. Please wait a few seconds."
//       });
//     }

//     return res.json([]);
//   }
// });

// /* ======================
//    ADD CRYPTO
// ====================== */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const { symbol } = req.body;

//     if (!symbol || !String(symbol).trim()) {
//       return res.status(400).json({ message: "Symbol required" });
//     }

//     const coinId = String(symbol).toLowerCase().trim();

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query: coinId }
//       }
//     );

//     const coins = Array.isArray(response.data?.coins) ? response.data.coins : [];

//     const coinExists = coins.find(
//       (coin) => coin.id.toLowerCase() === coinId
//     );

//     if (!coinExists) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     const alreadyAdded = req.user.cryptos.some(
//       (c) => String(c).toLowerCase() === coinId
//     );

//     if (alreadyAdded) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     req.user.cryptos.push(coinId);

//     // Force Mongoose to track array update
//     req.user.markModified("cryptos");

//     console.log("Before save cryptos:", req.user.cryptos);

//     await req.user.save();

//     const updatedUser = await User.findById(req.user._id).lean();
//     console.log("After save cryptos from DB:", updatedUser?.cryptos);

//     return res.json({
//       success: true,
//       message: `${coinId} added`
//     });
//   } catch (err) {
//     console.error("Add crypto error:", err.response?.data || err.message);

//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Rate limit reached. Please try again in a moment."
//       });
//     }

//     return res.status(500).json({
//       message: "Failed to add crypto"
//     });
//   }
// });

// /* ======================
//    DELETE CRYPTO
// ====================== */

// router.delete("/crypto/delete/:symbol", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const { symbol } = req.params;

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     const index = req.user.cryptos.findIndex(
//       (coin) => String(coin).toLowerCase() === String(symbol).toLowerCase()
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `${symbol} not in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);

//     // Force Mongoose to track array update
//     req.user.markModified("cryptos");

//     await req.user.save();

//     const updatedUser = await User.findById(req.user._id).lean();
//     console.log("After delete cryptos from DB:", updatedUser?.cryptos);

//     return res.json({
//       success: true,
//       message: `${symbol} removed`
//     });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Delete failed"
//     });
//   }
// });

// module.exports = router;




// import express from "express";
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// import {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } from "../controller/authController.js";

// const router = express.Router();

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* ---------------- AUTH MIDDLEWARE ---------------- */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Unauthorized",
//       error: err.message
//     });
//   }
// };

// /* ---------------- HELPERS ---------------- */

// const cryptoCache = new Map();
// const searchCache = new Map();

// const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// const setNoCache = (res) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
// };

// const clearPortfolioCache = () => {
//   cryptoCache.clear();
// };

// const normalizeCoinId = (value) => String(value || "").toLowerCase().trim();

// /* ---------------- GET CRYPTOS ---------------- */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     // always fetch fresh user from DB
//     const freshUser = await User.findById(req.user._id).lean();

//     const symbols = Array.isArray(freshUser?.cryptos)
//       ? freshUser.cryptos.map(normalizeCoinId).filter(Boolean)
//       : [];

//     console.log("Fresh DB cryptos:", symbols);

//     if (!symbols.length) {
//       return res.json([]);
//     }

//     const ids = symbols.join(",");

//     const cached = cryptoCache.get(ids);
//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     const raw = Array.isArray(response.data) ? response.data : [];

//     console.log("CoinGecko markets response ids:", raw.map((c) => c.id));

//     const data = raw.map((coin) => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//       image: coin.image,
//       current_price: coin.current_price,
//       price_change_percentage_1h_in_currency:
//         coin.price_change_percentage_1h_in_currency,
//       price_change_percentage_24h: coin.price_change_percentage_24h,
//       price_change_percentage_7d_in_currency:
//         coin.price_change_percentage_7d_in_currency
//     }));

//     cryptoCache.set(ids, {
//       data,
//       timestamp: Date.now()
//     });

//     return res.json(data);
//   } catch (err) {
//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "CoinGecko rate limit reached. Please wait a moment."
//       });
//     }

//     console.error("Crypto fetch error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Internal server error"
//     });
//   }
// });

// /* ---------------- ADD CRYPTO ---------------- */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const coinInput = req.body.symbol || req.body.id;

//     if (!coinInput) {
//       return res.status(400).json({ message: "Coin required" });
//     }

//     const coinId = normalizeCoinId(coinInput);

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     // verify coin exists in CoinGecko search
//     const searchResponse = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query: coinId }
//       }
//     );

//     const foundCoins = Array.isArray(searchResponse.data?.coins)
//       ? searchResponse.data.coins
//       : [];

//     const exactMatch = foundCoins.find(
//       (coin) => normalizeCoinId(coin.id) === coinId
//     );

//     if (!exactMatch) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     const alreadyExists = req.user.cryptos.some(
//       (coin) => normalizeCoinId(coin) === coinId
//     );

//     if (alreadyExists) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     req.user.cryptos.push(coinId);
//     req.user.markModified("cryptos");

//     console.log("Before save cryptos:", req.user.cryptos);

//     await req.user.save();

//     const updatedUser = await User.findById(req.user._id).lean();
//     console.log("After save cryptos from DB:", updatedUser?.cryptos);

//     clearPortfolioCache();

//     return res.json({
//       success: true,
//       message: `${coinId} added successfully`
//     });
//   } catch (err) {
//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Rate limit reached. Please try again in a moment."
//       });
//     }

//     console.error("Add crypto error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Failed to add cryptocurrency"
//     });
//   }
// });

// /* ---------------- SEARCH CRYPTO ---------------- */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const query = normalizeCoinId(req.query.query);

//     if (!query || query.length < 3) {
//       return res.json([]);
//     }

//     const cached = searchCache.get(query);
//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query }
//       }
//     );

//     const result = (Array.isArray(response.data?.coins) ? response.data.coins : [])
//       .map((coin) => ({
//         id: coin.id,
//         name: coin.name,
//         symbol: coin.symbol
//       }))
//       .slice(0, 10);

//     searchCache.set(query, {
//       data: result,
//       timestamp: Date.now()
//     });

//     return res.json(result);
//   } catch (err) {
//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Too many search requests. Please wait a moment."
//       });
//     }

//     console.error("Search error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Search failed"
//     });
//   }
// });

// /* ---------------- DELETE CRYPTO ---------------- */

// router.delete("/crypto/delete/:id", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const id = normalizeCoinId(req.params.id);

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     const index = req.user.cryptos.findIndex(
//       (coin) => normalizeCoinId(coin) === id
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `"${id}" not found in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);
//     req.user.markModified("cryptos");

//     await req.user.save();

//     const updatedUser = await User.findById(req.user._id).lean();
//     console.log("After delete cryptos from DB:", updatedUser?.cryptos);

//     clearPortfolioCache();

//     return res.json({
//       success: true,
//       message: `${id} removed successfully`
//     });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Server error during deletion"
//     });
//   }
// });

// export default router;




// import express from "express";
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// import {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } from "../controller/authController.js";

// const router = express.Router();

// /* ---------------- AUTH ROUTES ---------------- */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* ---------------- AUTH MIDDLEWARE ---------------- */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Unauthorized",
//       error: err.message
//     });
//   }
// };

// /* ---------------- HELPERS / CACHE ---------------- */

// const cryptoCache = new Map();
// const searchCache = new Map();

// const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// const setNoCache = (res) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
// };

// const normalizeCoinId = (value) => String(value || "").toLowerCase().trim();

// const clearCryptoCache = () => {
//   cryptoCache.clear();
// };

// /* ---------------- GET CRYPTOS ---------------- */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   setNoCache(res);

//   let ids = "";

//   try {
//     const freshUser = await User.findById(req.user._id).lean();

//     const symbols = Array.isArray(freshUser?.cryptos)
//       ? freshUser.cryptos.map(normalizeCoinId).filter(Boolean)
//       : [];

//     if (!symbols.length) {
//       return res.json([]);
//     }

//     ids = symbols.join(",");

//     const cached = cryptoCache.get(ids);
//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     const raw = Array.isArray(response.data) ? response.data : [];

//     const data = raw.map((coin) => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//       image: coin.image,
//       current_price: coin.current_price,
//       price_change_percentage_1h_in_currency:
//         coin.price_change_percentage_1h_in_currency,
//       price_change_percentage_24h: coin.price_change_percentage_24h,
//       price_change_percentage_7d_in_currency:
//         coin.price_change_percentage_7d_in_currency
//     }));

//     cryptoCache.set(ids, {
//       data,
//       timestamp: Date.now()
//     });

//     return res.json(data);
//   } catch (err) {
//     const cached = ids ? cryptoCache.get(ids) : null;

//     if (err.response?.status === 429) {
//       if (cached) {
//         return res.json(cached.data);
//       }

//       return res.status(429).json({
//         message: "CoinGecko rate limit reached. Please wait a moment."
//       });
//     }

//     console.error("Crypto fetch error:", err.response?.data || err.message);

//     if (cached) {
//       return res.json(cached.data);
//     }

//     return res.status(500).json({
//       message: "Internal server error"
//     });
//   }
// });

// /* ---------------- ADD CRYPTO ---------------- */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const coinInput = req.body.symbol || req.body.id;

//     if (!coinInput) {
//       return res.status(400).json({ message: "Coin required" });
//     }

//     const coinId = normalizeCoinId(coinInput);

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     const alreadyExists = req.user.cryptos.some(
//       (coin) => normalizeCoinId(coin) === coinId
//     );

//     if (alreadyExists) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     // Verify coin exists using CoinGecko search
//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query: coinId }
//       }
//     );

//     const foundCoins = Array.isArray(response.data?.coins)
//       ? response.data.coins
//       : [];

//     const exactMatch = foundCoins.find(
//       (coin) => normalizeCoinId(coin.id) === coinId
//     );

//     if (!exactMatch) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     req.user.cryptos.push(coinId);
//     req.user.markModified("cryptos");

//     await req.user.save();
//     clearCryptoCache();

//     return res.json({
//       success: true,
//       message: `${coinId} added successfully`
//     });
//   } catch (err) {
//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Rate limit reached. Please try again in a moment."
//       });
//     }

//     console.error("Add crypto error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Failed to add cryptocurrency"
//     });
//   }
// });

// /* ---------------- SEARCH CRYPTO ---------------- */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const query = normalizeCoinId(req.query.query);

//     if (!query || query.length < 3) {
//       return res.json([]);
//     }

//     const cached = searchCache.get(query);
//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query }
//       }
//     );

//     const result = (Array.isArray(response.data?.coins) ? response.data.coins : [])
//       .map((coin) => ({
//         id: coin.id,
//         name: coin.name,
//         symbol: coin.symbol
//       }))
//       .slice(0, 10);

//     searchCache.set(query, {
//       data: result,
//       timestamp: Date.now()
//     });

//     return res.json(result);
//   } catch (err) {
//     if (err.response?.status === 429) {
//       const query = normalizeCoinId(req.query.query);
//       const cached = searchCache.get(query);

//       if (cached) {
//         return res.json(cached.data);
//       }

//       return res.status(429).json({
//         message: "Too many search requests. Please wait a moment."
//       });
//     }

//     console.error("Search error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Search failed"
//     });
//   }
// });

// /* ---------------- DELETE CRYPTO ---------------- */

// router.delete("/crypto/delete/:id", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const id = normalizeCoinId(req.params.id);

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     const index = req.user.cryptos.findIndex(
//       (coin) => normalizeCoinId(coin) === id
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `"${id}" not found in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);
//     req.user.markModified("cryptos");

//     await req.user.save();
//     clearCryptoCache();

//     return res.json({
//       success: true,
//       message: `${id} removed successfully`
//     });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Server error during deletion"
//     });
//   }
// });

// export default router;













// const express = require("express");
// const axios = require("axios");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const {
//   signUp,
//   login,
//   sendOTP,
//   verifyOTP,
//   googleSignIn
// } = require("../controller/authController");

// const router = express.Router();

// /* ---------------- AUTH ROUTES ---------------- */

// router.post("/signup", signUp);
// router.post("/login", login);
// router.post("/forgot-password", sendOTP);
// router.post("/verify-otp", verifyOTP);
// router.post("/google", googleSignIn);

// /* ---------------- AUTH MIDDLEWARE ---------------- */

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Unauthorized",
//       error: err.message
//     });
//   }
// };

// /* ---------------- HELPERS / CACHE ---------------- */

// const cryptoCache = new Map();
// const searchCache = new Map();

// const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// const setNoCache = (res) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
// };

// const normalizeCoinId = (value) => String(value || "").toLowerCase().trim();

// const clearCryptoCache = () => {
//   cryptoCache.clear();
// };

// /* ---------------- GET CRYPTOS ---------------- */

// router.get("/cryptos", authenticateUser, async (req, res) => {
//   setNoCache(res);

//   let ids = "";

//   try {
//     const freshUser = await User.findById(req.user._id).lean();

//     const symbols = Array.isArray(freshUser?.cryptos)
//       ? freshUser.cryptos.map(normalizeCoinId).filter(Boolean)
//       : [];

//     if (!symbols.length) {
//       return res.json([]);
//     }

//     ids = symbols.join(",");

//     const cached = cryptoCache.get(ids);
//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/markets",
//       {
//         params: {
//           vs_currency: "usd",
//           ids,
//           price_change_percentage: "1h,24h,7d"
//         }
//       }
//     );

//     const raw = Array.isArray(response.data) ? response.data : [];

//     const data = raw.map((coin) => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//       image: coin.image,
//       current_price: coin.current_price,
//       price_change_percentage_1h_in_currency:
//         coin.price_change_percentage_1h_in_currency,
//       price_change_percentage_24h: coin.price_change_percentage_24h,
//       price_change_percentage_7d_in_currency:
//         coin.price_change_percentage_7d_in_currency
//     }));

//     cryptoCache.set(ids, {
//       data,
//       timestamp: Date.now()
//     });

//     return res.json(data);
//   } catch (err) {
//     const cached = ids ? cryptoCache.get(ids) : null;

//     if (err.response?.status === 429) {
//       if (cached) {
//         return res.json(cached.data);
//       }

//       return res.status(429).json({
//         message: "CoinGecko rate limit reached. Please wait a moment."
//       });
//     }

//     console.error("Crypto fetch error:", err.response?.data || err.message);

//     if (cached) {
//       return res.json(cached.data);
//     }

//     return res.status(500).json({
//       message: "Internal server error"
//     });
//   }
// });

// /* ---------------- ADD CRYPTO ---------------- */

// router.post("/crypto/add", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const coinInput = req.body.symbol || req.body.id;

//     if (!coinInput) {
//       return res.status(400).json({ message: "Coin required" });
//     }

//     const coinId = normalizeCoinId(coinInput);

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     const alreadyExists = req.user.cryptos.some(
//       (coin) => normalizeCoinId(coin) === coinId
//     );

//     if (alreadyExists) {
//       return res.json({
//         success: true,
//         message: "Already added"
//       });
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query: coinId }
//       }
//     );

//     const foundCoins = Array.isArray(response.data?.coins)
//       ? response.data.coins
//       : [];

//     const exactMatch = foundCoins.find(
//       (coin) => normalizeCoinId(coin.id) === coinId
//     );

//     if (!exactMatch) {
//       return res.status(404).json({
//         message: `"${coinId}" not found`
//       });
//     }

//     req.user.cryptos.push(coinId);
//     req.user.markModified("cryptos");

//     await req.user.save();
//     clearCryptoCache();

//     return res.json({
//       success: true,
//       message: `${coinId} added successfully`
//     });
//   } catch (err) {
//     if (err.response?.status === 429) {
//       return res.status(429).json({
//         message: "Rate limit reached. Please try again in a moment."
//       });
//     }

//     console.error("Add crypto error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Failed to add cryptocurrency"
//     });
//   }
// });

// /* ---------------- SEARCH CRYPTO ---------------- */

// router.get("/crypto/search", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const query = normalizeCoinId(req.query.query);

//     if (!query || query.length < 3) {
//       return res.json([]);
//     }

//     const cached = searchCache.get(query);
//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return res.json(cached.data);
//     }

//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/search",
//       {
//         params: { query }
//       }
//     );

//     const result = (Array.isArray(response.data?.coins) ? response.data.coins : [])
//       .map((coin) => ({
//         id: coin.id,
//         name: coin.name,
//         symbol: coin.symbol
//       }))
//       .slice(0, 10);

//     searchCache.set(query, {
//       data: result,
//       timestamp: Date.now()
//     });

//     return res.json(result);
//   } catch (err) {
//     if (err.response?.status === 429) {
//       const query = normalizeCoinId(req.query.query);
//       const cached = searchCache.get(query);

//       if (cached) {
//         return res.json(cached.data);
//       }

//       return res.status(429).json({
//         message: "Too many search requests. Please wait a moment."
//       });
//     }

//     console.error("Search error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Search failed"
//     });
//   }
// });

// /* ---------------- DELETE CRYPTO ---------------- */

// router.delete("/crypto/delete/:id", authenticateUser, async (req, res) => {
//   try {
//     setNoCache(res);

//     const id = normalizeCoinId(req.params.id);

//     if (!Array.isArray(req.user.cryptos)) {
//       req.user.cryptos = [];
//     }

//     const index = req.user.cryptos.findIndex(
//       (coin) => normalizeCoinId(coin) === id
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         message: `"${id}" not found in portfolio`
//       });
//     }

//     req.user.cryptos.splice(index, 1);
//     req.user.markModified("cryptos");

//     await req.user.save();
//     clearCryptoCache();

//     return res.json({
//       success: true,
//       message: `${id} removed successfully`
//     });
//   } catch (err) {
//     console.error("Delete error:", err.response?.data || err.message);

//     return res.status(500).json({
//       message: "Server error during deletion"
//     });
//   }
// });

// module.exports = router;









import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import {
  signUp,
  login,
  sendOTP,
  verifyOTP,
  googleSignIn
} from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google", googleSignIn);

// ---------------- AUTH MIDDLEWARE ----------------

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message
    });
  }
};

// ---------------- CACHE ----------------

const cryptoCache = new Map();
const searchCache = new Map();

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// ---------------- GET CRYPTOS ----------------

router.get("/cryptos", authenticateUser, async (req, res) => {
  let ids = "";

  try {
    const symbols = Array.isArray(req.user.cryptos) ? req.user.cryptos : [];

    if (!symbols.length) return res.json([]);

    ids = symbols.join(",");

    const cached = cryptoCache.get(ids);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json(cached.data);
    }

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          ids,
          price_change_percentage: "1h,24h,7d"
        }
      }
    );

    const data = Array.isArray(response.data)
      ? response.data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          current_price: coin.current_price,
          price_change_percentage_1h_in_currency:
            coin.price_change_percentage_1h_in_currency,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          price_change_percentage_7d_in_currency:
            coin.price_change_percentage_7d_in_currency
        }))
      : [];

    cryptoCache.set(ids, {
      data,
      timestamp: Date.now()
    });

    res.json(data);
  } catch (err) {
    const cached = ids ? cryptoCache.get(ids) : null;

    if (err.response?.status === 429) {
      if (cached) {
        return res.json(cached.data);
      }

      return res.status(429).json({
        message: "CoinGecko rate limit reached. Please wait a moment."
      });
    }

    console.error("Crypto fetch error:", err.response?.data || err.message);

    if (cached) {
      return res.json(cached.data);
    }

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

// ---------------- ADD CRYPTO ----------------

router.post("/crypto/add", authenticateUser, async (req, res) => {
  try {
    const coinInput = req.body.symbol || req.body.id;

    if (!coinInput)
      return res.status(400).json({ message: "Coin required" });

    const coinId = coinInput.toLowerCase().trim();

    if (!Array.isArray(req.user.cryptos)) {
      req.user.cryptos = [];
    }

    // prevent duplicates
    if (req.user.cryptos.includes(coinId))
      return res.status(400).json({
        message: `${coinId} already exists`
      });

    req.user.cryptos.push(coinId);
    await req.user.save();

    cryptoCache.clear();

    res.json({
      success: true,
      message: `${coinId} added successfully`
    });
  } catch (err) {
    console.error("Add crypto error:", err.message);

    res.status(500).json({
      message: "Failed to add cryptocurrency"
    });
  }
});

// ---------------- SEARCH CRYPTO ----------------

router.get("/crypto/search", authenticateUser, async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase() || "";

    if (!query) return res.json([]);

    const cached = searchCache.get(query);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json(cached.data);
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/search?query=${query}`
    );

    const result = response.data.coins
      .map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol
      }))
      .slice(0, 10);

    searchCache.set(query, {
      data: result,
      timestamp: Date.now()
    });

    res.json(result);
  } catch (err) {
    const query = req.query.query?.toLowerCase() || "";
    const cached = searchCache.get(query);

    if (err.response?.status === 429) {
      if (cached) {
        return res.json(cached.data);
      }

      return res.status(429).json({
        message: "Too many search requests. Please wait a moment."
      });
    }

    console.error("Search error:", err.message);

    res.status(500).json({
      message: "Search failed"
    });
  }
});

// ---------------- DELETE CRYPTO ----------------

router.delete("/crypto/delete/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const index = req.user.cryptos.findIndex(
      (coin) => coin.toLowerCase() === id.toLowerCase()
    );

    if (index === -1)
      return res.status(404).json({
        message: `"${id}" not found in portfolio`
      });

    req.user.cryptos.splice(index, 1);
    await req.user.save();

    cryptoCache.clear();

    res.json({
      success: true,
      message: `${id} removed successfully`
    });
  } catch (err) {
    console.error("Delete error:", err.message);

    res.status(500).json({
      message: "Server error during deletion"
    });
  }
});

export default router;