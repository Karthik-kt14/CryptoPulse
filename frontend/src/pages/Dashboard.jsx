// import { useState, useEffect, useRef } from "react";
// import { fetchCryptos, addCrypto } from "../services/api";
// import CryptoCard from "../components/CryptoCard";
// import { useNavigate } from "react-router-dom";
// import coinList from "../data/coins.json";
// import { RiLogoutBoxLine } from "react-icons/ri";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [cryptos, setCryptos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const popupRef = useRef();
//   const searchInputRef = useRef();

//   // Auto logout if no token
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   // Fetch user's crypto list
//   useEffect(() => {
//     const getCryptos = async () => {
//       setLoading(true);
//       try {
//         const res = await fetchCryptos();
//         setCryptos(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch crypto data");
//       }
//       setLoading(false);
//     };
//     getCryptos();
//   }, []);

//   useEffect(() => {
//     if (searchInput.length > 0) {
//       const filtered = coinList.filter((coin) =>
//         coin.name.toLowerCase().includes(searchInput.toLowerCase()) ||
//         coin.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
//         coin.id.toLowerCase().includes(searchInput.toLowerCase())
//       );
//       setSuggestions(filtered.slice(0, 10));
//     } else {
//       setSuggestions([]);
//     }
//   }, [searchInput]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         closePopup();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Add crypto handler
//   const handleAddCrypto = async (symbol) => {
//     const cryptoToAdd = symbol || searchInput.trim();
//     if (!cryptoToAdd) {
//       setError("Please enter a cryptocurrency symbol or select from the list");
//       return;
//     }
//     setIsAdding(true);
//     setError("");
//     try {
//       const result = await addCrypto(cryptoToAdd);
//       if (result.success) {
//         const res = await fetchCryptos();
//         setCryptos(res.data);
//         closePopup();
//       } else {
//         throw new Error(result.message || "Failed to add cryptocurrency");
//       }
//     } catch (err) {
//       let errorMessage = err.response?.data?.message || err.message;
//       if (err.response?.status === 404) {
//         errorMessage = `"${cryptoToAdd}" not found. Try:\n`;
//         if (err.response.data?.suggestions) {
//           errorMessage += err.response.data.suggestions.join("\n");
//         }
//       } else if (err.response?.status === 500) {
//         errorMessage = `Server error adding "${cryptoToAdd}". Try again later.`;
//       }
//       setError(errorMessage);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   // Handle Enter key
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddCrypto();
//     }
//   };

//   // Close popup
//   const closePopup = () => {
//     setShowPopup(false);
//     setSearchInput("");
//     setSuggestions([]);
//     setError("");
//   };

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Crypto Dashboard</h1>
//             <p className="text-gray-400">Track your favorite ❤️ cryptocurrencies</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             <RiLogoutBoxLine className="inline-block text-xl"/> Logout
//           </button>
//         </header>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-12 text-white">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
//             <p>Loading your cryptocurrencies...</p>
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div className="bg-red-900/80 text-red-100 p-4 mb-4 rounded-lg">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="font-semibold">Couldn't add cryptocurrency:</div>
//                 <div className="whitespace-pre-line mt-1">{error}</div>
//               </div>
//               <button 
//                 onClick={() => setError("")}
//                 className="text-white hover:text-gray-200 ml-2"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="mt-3 pt-3 border-t border-red-800 text-sm">
//               <div className="font-medium">Try these:</div>
//               <ul className="list-disc pl-5 mt-1 space-y-1">
//                 <li>Search and select from the dropdown</li>
//                 <li>Use official ID (like "ripple")</li>
//                 <li>Use symbol (like "xrp")</li>
//                 <li>Check for typos</li>
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Crypto Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {cryptos.map((crypto) => (
//             <CryptoCard
//             key={crypto.id}
//             crypto={crypto}
//             onDelete={(deletedId) => {
//               setCryptos(prev => prev.filter(c => c.id !== deletedId));
//             }}
//           />
//           ))}
          
//           {/* Add New Crypto Card */}
//           <div
//             className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48 transition-colors"
//             onClick={() => {
//               setShowPopup(true);
//               setTimeout(() => searchInputRef.current?.focus(), 100);
//             }}
//           >
//             <span className="text-white text-4xl">+</span>
//           </div>
//         </div>

//         {/* Popup */}
//         {showPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div ref={popupRef} className="bg-gray-800 rounded-xl shadow-lg p-6 w-80 max-w-[95vw]">
//               <h3 className="text-lg font-bold mb-4 text-white">Add Cryptocurrency</h3>
//               <div className="text-sm text-gray-400 mb-2">
//                 Tip: Use name, symbol or official ID
//               </div>
//               <form onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddCrypto();
//               }}>
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="e.g. bitcoin, btc, ripple..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   autoFocus
//                 />
//                 {suggestions.length > 0 && (
//                   <ul className="max-h-40 overflow-y-auto space-y-2 mb-4">
//                     {suggestions.map((coin) => (
//                       <li
//                         key={coin.id}
//                         onClick={() => {
//                           setSearchInput(coin.id);
//                           setSuggestions([]);
//                         }}
//                         className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
//                         title={`ID: ${coin.id}`}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span>{coin.name}</span>
//                           <span className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</span>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex justify-center items-center"
//                   disabled={!searchInput.trim() || isAdding}
//                 >
//                   {isAdding ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Adding...
//                     </>
//                   ) : (
//                     `Add ${searchInput.trim().toUpperCase() || 'Crypto'}`
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import { useState, useEffect, useRef } from "react";
// import { fetchCryptos, addCrypto } from "../services/api";
// import CryptoCard from "../components/CryptoCard";
// import { useNavigate } from "react-router-dom";
// import coinList from "../data/coins.json";
// import { RiLogoutBoxLine } from "react-icons/ri";

// export default function Dashboard() {

//   const navigate = useNavigate();

//   const [cryptos, setCryptos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showPopup, setShowPopup] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [isAdding, setIsAdding] = useState(false);

//   const popupRef = useRef();
//   const searchInputRef = useRef();

//   // Redirect if not logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   // Fetch user cryptos
//   useEffect(() => {
//     const getCryptos = async () => {
//       setLoading(true);
//       try {
//         const res = await fetchCryptos();
//         setCryptos(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch crypto data");
//       }
//       setLoading(false);
//     };

//     getCryptos();
//   }, []);

//   // Filter coin suggestions
//   useEffect(() => {

//     if (searchInput.length > 0) {

//       const filtered = coinList.filter((coin) =>
//         coin.name.toLowerCase().includes(searchInput.toLowerCase()) ||
//         coin.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
//         coin.id.toLowerCase().includes(searchInput.toLowerCase())
//       );

//       setSuggestions(filtered.slice(0, 10));

//     } else {

//       setSuggestions([]);

//     }

//   }, [searchInput]);

//   // Close popup on outside click
//   useEffect(() => {

//     const handleClickOutside = (event) => {

//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         closePopup();
//       }

//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);

//   }, []);

//   /* =========================
//      ADD CRYPTO FIXED
//   ========================= */

//   const handleAddCrypto = async (symbol) => {

//     const cryptoToAdd = symbol || searchInput.trim();

//     if (!cryptoToAdd) {
//       setError("Please enter a cryptocurrency symbol or select from the list");
//       return;
//     }

//     setIsAdding(true);
//     setError("");

//     try {

//       const result = await addCrypto(cryptoToAdd);

//       if (result.data && result.data.success) {

//         const res = await fetchCryptos();
//         setCryptos(res.data);

//         closePopup();

//       } else {

//         throw new Error(result.data?.message || "Failed to add cryptocurrency");

//       }

//     } catch (err) {

//       let errorMessage = err.response?.data?.message || err.message;

//       if (err.response?.status === 404) {

//         errorMessage = `"${cryptoToAdd}" not found`;

//       } else if (err.response?.status === 500) {

//         errorMessage = `Server error adding "${cryptoToAdd}". Try again later.`;

//       }

//       setError(errorMessage);

//     } finally {

//       setIsAdding(false);

//     }

//   };

//   // Enter key add
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddCrypto();
//     }
//   };

//   // Close popup
//   const closePopup = () => {
//     setShowPopup(false);
//     setSearchInput("");
//     setSuggestions([]);
//     setError("");
//   };

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (

//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">

//       <div className="max-w-7xl mx-auto">

//         {/* Header */}

//         <header className="flex justify-between items-center mb-8">

//           <div>
//             <h1 className="text-3xl font-bold text-white">
//               Crypto Dashboard
//             </h1>

//             <p className="text-gray-400">
//               Track your favorite ❤️ cryptocurrencies
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             <RiLogoutBoxLine className="inline-block text-xl" /> Logout
//           </button>

//         </header>

//         {/* Loading */}

//         {loading && (
//           <div className="text-center py-12 text-white">

//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>

//             <p>Loading your cryptocurrencies...</p>

//           </div>
//         )}

//         {/* Error */}

//         {error && (
//           <div className="bg-red-900/80 text-red-100 p-4 mb-4 rounded-lg">

//             <div className="flex justify-between items-start">

//               <div className="flex-1">

//                 <div className="font-semibold">
//                   Couldn't add cryptocurrency:
//                 </div>

//                 <div className="whitespace-pre-line mt-1">
//                   {error}
//                 </div>

//               </div>

//               <button
//                 onClick={() => setError("")}
//                 className="text-white hover:text-gray-200 ml-2"
//               >
//                 ×
//               </button>

//             </div>

//           </div>
//         )}

//         {/* Crypto Cards */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

//           {cryptos.map((crypto) => (

//             <CryptoCard
//               key={crypto.id}
//               crypto={crypto}
//               onDelete={(deletedId) => {
//                 setCryptos((prev) =>
//                   prev.filter((c) => c.id !== deletedId)
//                 );
//               }}
//             />

//           ))}

//           {/* Add Crypto Card */}

//           <div
//             className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48 transition-colors"
//             onClick={() => {
//               setShowPopup(true);
//               setTimeout(() => searchInputRef.current?.focus(), 100);
//             }}
//           >
//             <span className="text-white text-4xl">+</span>
//           </div>

//         </div>

//         {/* Add Crypto Popup */}

//         {showPopup && (

//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

//             <div
//               ref={popupRef}
//               className="bg-gray-800 rounded-xl shadow-lg p-6 w-80 max-w-[95vw]"
//             >

//               <h3 className="text-lg font-bold mb-4 text-white">
//                 Add Cryptocurrency
//               </h3>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAddCrypto();
//                 }}
//               >

//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="bitcoin, ethereum, solana..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2 mb-4"
//                 />

//                 {suggestions.length > 0 && (

//                   <ul className="max-h-40 overflow-y-auto space-y-2 mb-4">

//                     {suggestions.map((coin) => (

//                       <li
//                         key={coin.id}
//                         onClick={() => {
//                           setSearchInput(coin.id);
//                           setSuggestions([]);
//                         }}
//                         className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
//                       >

//                         <div className="flex justify-between">

//                           <span>{coin.name}</span>

//                           <span className="text-gray-400 text-sm">
//                             {coin.symbol.toUpperCase()}
//                           </span>

//                         </div>

//                       </li>

//                     ))}

//                   </ul>

//                 )}

//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//                   disabled={!searchInput.trim() || isAdding}
//                 >

//                   {isAdding ? "Adding..." : `Add ${searchInput.toUpperCase()}`}

//                 </button>

//               </form>

//             </div>

//           </div>

//         )}

//       </div>

//     </div>

//   );
// }











// import { useState, useEffect, useRef } from "react";
// import { fetchCryptos, addCrypto, searchCrypto } from "../services/api";
// import CryptoCard from "../components/CryptoCard";
// import { useNavigate } from "react-router-dom";
// import { RiLogoutBoxLine } from "react-icons/ri";

// export default function Dashboard() {

//   const navigate = useNavigate();

//   const [cryptos, setCryptos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showPopup, setShowPopup] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [isAdding, setIsAdding] = useState(false);

//   const popupRef = useRef();
//   const searchInputRef = useRef();

//   /* =========================
//      Redirect if not logged in
//   ========================= */

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   /* =========================
//      Fetch user cryptos
//   ========================= */

//   // useEffect(() => {

//   //   const getCryptos = async () => {

//   //     setLoading(true);

//   //     try {

//   //       const res = await fetchCryptos();
//   //       setCryptos(res.data);

//   //     } catch (err) {

//   //       setError(err.response?.data?.message || "Failed to fetch crypto data");

//   //     }

//   //     setLoading(false);

//   //   };

//   //   getCryptos();

//   // }, []);
// useEffect(() => {

//   const getCryptos = async () => {

//     try {

//       setLoading(true);

//       const res = await fetchCryptos();

//       console.log("Fetched cryptos:", res.data);

//       if (Array.isArray(res.data)) {
//         setCryptos(res.data);
//       } else {
//         setCryptos([]);
//       }

//     } catch (err) {

//       console.error("Fetch crypto error:", err);

//       setCryptos([]);

//     } finally {

//       setLoading(false);

//     }

//   };

//   getCryptos();

// }, []);
//   /* =========================
//      LIVE SEARCH FROM API
//   ========================= */

//   useEffect(() => {

//     const fetchSuggestions = async () => {

//       if (!searchInput.trim()) {
//         setSuggestions([]);
//         return;
//       }

//       try {

//         const res = await searchCrypto(searchInput);

//         setSuggestions(res.data);

//       } catch (err) {

//         console.log("Search failed", err);

//       }

//     };

//     fetchSuggestions();

//   }, [searchInput]);

//   /* =========================
//      Close popup on outside click
//   ========================= */

//   useEffect(() => {

//     const handleClickOutside = (event) => {

//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         closePopup();
//       }

//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);

//   }, []);

//   /* =========================
//      ADD CRYPTO
//   ========================= */

//   const handleAddCrypto = async (symbol) => {

//     const cryptoToAdd = symbol || searchInput.trim();

//     if (!cryptoToAdd) {
//       setError("Please enter a cryptocurrency");
//       return;
//     }

//     setIsAdding(true);
//     setError("");

//     try {

//       // const result = await addCrypto(cryptoToAdd);

//       // if (result.data && result.data.success) {

//       //   const res = await fetchCryptos();
//       //   setCryptos(res.data);

//       //   closePopup();

//       // } 
//       const result = await addCrypto(cryptoToAdd);

// if (result.data?.message === "Already added") {
//   closePopup();
//   return;
// }

// if (result.data?.success) {

//   const res = await fetchCryptos();

//   if (Array.isArray(res.data)) {
//     setCryptos(res.data);
//   }

//   closePopup();
// }
//       else {

//         throw new Error(result.data?.message || "Failed to add crypto");

//       }

//     } catch (err) {

//       let errorMessage = err.response?.data?.message || err.message;

//       setError(errorMessage);

//     } finally {

//       setIsAdding(false);

//     }

//   };

//   /* =========================
//      Enter key add
//   ========================= */

//   const handleKeyDown = (e) => {

//     if (e.key === "Enter") {

//       e.preventDefault();
//       handleAddCrypto();

//     }

//   };

//   /* =========================
//      Close popup
//   ========================= */

//   const closePopup = () => {

//     setShowPopup(false);
//     setSearchInput("");
//     setSuggestions([]);
//     setError("");

//   };

//   /* =========================
//      Logout
//   ========================= */

//   const handleLogout = () => {

//     localStorage.removeItem("token");
//     navigate("/login");

//   };

//   return (

//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">

//       <div className="max-w-7xl mx-auto">

//         {/* Header */}

//         <header className="flex justify-between items-center mb-8">

//           <div>

//             <h1 className="text-3xl font-bold text-white">
//               Crypto Dashboard
//             </h1>

//             <p className="text-gray-400">
//               Track your favorite ❤️ cryptocurrencies
//             </p>

//           </div>

//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//           >
//             <RiLogoutBoxLine className="inline-block text-xl"/> Logout
//           </button>

//         </header>

//         {/* Loading */}

//         {loading && (
//           <div className="text-center py-12 text-white">
//             <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2 rounded-full"></div>
//             <p>Loading your cryptocurrencies...</p>
//           </div>
//         )}

//         {/* Error */}

//         {error && (

//           <div className="bg-red-900 text-red-100 p-4 mb-4 rounded-lg">

//             <div className="flex justify-between">

//               <div>{error}</div>

//               <button onClick={() => setError("")}>×</button>

//             </div>

//           </div>

//         )}

//         {/* Crypto Grid */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

//           {cryptos.map((crypto) => (

//             <CryptoCard
//               key={crypto.id}
//               crypto={crypto}
//               onDelete={(deletedId) =>
//                 setCryptos(prev => prev.filter(c => c.id !== deletedId))
//               }
//             />

//           ))}

//           {/* Add Card */}

//           <div
//             className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48"
//             onClick={() => {
//               setShowPopup(true);
//               setTimeout(() => searchInputRef.current?.focus(), 100);
//             }}
//           >
//             <span className="text-white text-4xl">+</span>
//           </div>

//         </div>

//         {/* Popup */}

//         {showPopup && (

//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

//             <div ref={popupRef} className="bg-gray-800 rounded-xl p-6 w-80">

//               <h3 className="text-white font-bold mb-4">
//                 Add Cryptocurrency
//               </h3>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAddCrypto();
//                 }}
//               >

//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="bitcoin, ethereum, solana..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-3"
//                 />

//                 {suggestions.length > 0 && (

//                   <ul className="max-h-40 overflow-y-auto mb-3 space-y-1">

//                     {suggestions.map((coin) => (

//                       <li
//                         key={coin.id}
//                         onClick={() => {
//                           setSearchInput(coin.id);
//                           setSuggestions([]);
//                         }}
//                         className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white cursor-pointer"
//                       >

//                         <div className="flex justify-between">

//                           <span>{coin.name}</span>

//                           <span className="text-gray-400 text-sm">
//                             {coin.symbol.toUpperCase()}
//                           </span>

//                         </div>

//                       </li>

//                     ))}

//                   </ul>

//                 )}

//                 <button
//                   type="submit"
//                   disabled={!searchInput.trim() || isAdding}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
//                 >

//                   {isAdding ? "Adding..." : `Add ${searchInput.toUpperCase()}`}

//                 </button>

//               </form>

//             </div>

//           </div>

//         )}

//       </div>

//     </div>

//   );

// }




// import { useState, useEffect, useRef } from "react";
// import { fetchCryptos, addCrypto, searchCrypto } from "../services/api";
// import CryptoCard from "../components/CryptoCard";
// import { useNavigate } from "react-router-dom";
// import { RiLogoutBoxLine } from "react-icons/ri";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [cryptos, setCryptos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showPopup, setShowPopup] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [searching, setSearching] = useState(false);

//   const popupRef = useRef(null);
//   const searchInputRef = useRef(null);

//   /* =========================
//      Redirect if not logged in
//   ========================= */
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   /* =========================
//      Fetch user cryptos
//   ========================= */
//   useEffect(() => {
//     const getCryptos = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await fetchCryptos();

//         if (Array.isArray(res.data)) {
//           setCryptos(res.data);
//         } else {
//           setCryptos([]);
//         }
//       } catch (err) {
//         console.error("Fetch crypto error:", err);
//         setCryptos([]);
//         setError(err.response?.data?.message || "Failed to fetch crypto data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getCryptos();
//   }, []);

//   /* =========================
//      LIVE SEARCH WITH DEBOUNCE
//   ========================= */
//   // useEffect(() => {
//   //   const delay = setTimeout(async () => {
//   //     const q = searchInput.trim();

//   //     if (!q) {
//   //       setSuggestions([]);
//   //       setSearching(false);
//   //       return;
//   //     }

//   //     if (q.length < 2) {
//   //       setSuggestions([]);
//   //       setSearching(false);
//   //       return;
//   //     }

//   //     try {
//   //       setSearching(true);
//   //       const res = await searchCrypto(q);
//   //       setSuggestions(Array.isArray(res.data) ? res.data : []);
//   //     } catch (err) {
//   //       console.error("Search failed:", err);
//   //       setSuggestions([]);
//   //     } finally {
//   //       setSearching(false);
//   //     }
//   //   }, 500);

//   //   return () => clearTimeout(delay);
//   // }, [searchInput]);

//   useEffect(() => {
//   const delay = setTimeout(async () => {
//     const q = searchInput.trim();

//     if (!q) {
//       setSuggestions([]);
//       setSearching(false);
//       return;
//     }

//     if (q.length < 3) {
//       setSuggestions([]);
//       setSearching(false);
//       return;
//     }

//     try {
//       setSearching(true);
//       const res = await searchCrypto(q);
//       setSuggestions(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Search failed:", err);
//       setSuggestions([]);
//     } finally {
//       setSearching(false);
//     }
//   }, 800);

//   return () => clearTimeout(delay);
// }, [searchInput]);
//   /* =========================
//      Close popup on outside click
//   ========================= */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         closePopup();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* =========================
//      ADD CRYPTO
//   ========================= */
//   const handleAddCrypto = async (symbol) => {
//     const cryptoToAdd = (symbol || searchInput).trim();

//     if (!cryptoToAdd) {
//       setError("Please enter a cryptocurrency");
//       return;
//     }

//     setIsAdding(true);
//     setError("");

//     try {
//       const result = await addCrypto(cryptoToAdd);

//       if (result.data?.message === "Already added") {
//         closePopup();
//         return;
//       }

//       if (result.data?.success) {
//         const res = await fetchCryptos();

//         if (Array.isArray(res.data)) {
//           setCryptos(res.data);
//         } else {
//           setCryptos([]);
//         }

//         closePopup();
//         return;
//       }

//       throw new Error(result.data?.message || "Failed to add crypto");
//     } catch (err) {
//       console.error("Add crypto error:", err);
//       const errorMessage =
//         err.response?.data?.message || err.message || "Failed to add crypto";
//       setError(errorMessage);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   /* =========================
//      Enter key add
//   ========================= */
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddCrypto();
//     }
//   };

//   /* =========================
//      Close popup
//   ========================= */
//   const closePopup = () => {
//     setShowPopup(false);
//     setSearchInput("");
//     setSuggestions([]);
//     setSearching(false);
//     setError("");
//   };

//   /* =========================
//      Logout
//   ========================= */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Crypto Dashboard</h1>
//             <p className="text-gray-400">
//               Track your favorite ❤️ cryptocurrencies
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//           >
//             <RiLogoutBoxLine className="inline-block text-xl" /> Logout
//           </button>
//         </header>

//         {loading && (
//           <div className="text-center py-12 text-white">
//             <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2 rounded-full"></div>
//             <p>Loading your cryptocurrencies...</p>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-900 text-red-100 p-4 mb-4 rounded-lg">
//             <div className="flex justify-between">
//               <div>{error}</div>
//               <button onClick={() => setError("")}>×</button>
//             </div>
//           </div>
//         )}

//         {!loading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {cryptos.map((crypto) => (
//               <CryptoCard
//                 key={crypto.id}
//                 crypto={crypto}
//                 onDelete={(deletedId) =>
//                   setCryptos((prev) => prev.filter((c) => c.id !== deletedId))
//                 }
//               />
//             ))}

//             <div
//               className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48"
//               onClick={() => {
//                 setShowPopup(true);
//                 setTimeout(() => searchInputRef.current?.focus(), 100);
//               }}
//             >
//               <span className="text-white text-4xl">+</span>
//             </div>
//           </div>
//         )}

//         {showPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div ref={popupRef} className="bg-gray-800 rounded-xl p-6 w-80">
//               <h3 className="text-white font-bold mb-4">Add Cryptocurrency</h3>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAddCrypto();
//                 }}
//               >
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="bitcoin, ethereum, solana..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-3"
//                 />

//                 {searching && (
//                   <div className="text-sm text-gray-400 mb-2">Searching...</div>
//                 )}

//                 {suggestions.length > 0 && (
//                   <ul className="max-h-40 overflow-y-auto mb-3 space-y-1">
//                     {suggestions.map((coin) => (
//                       <li
//                         key={coin.id}
//                         onClick={() => {
//                           setSearchInput(coin.id);
//                           setSuggestions([]);
//                         }}
//                         className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white cursor-pointer"
//                       >
//                         <div className="flex justify-between">
//                           <span>{coin.name}</span>
//                           <span className="text-gray-400 text-sm">
//                             {coin.symbol.toUpperCase()}
//                           </span>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={!searchInput.trim() || isAdding}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
//                 >
//                   {isAdding ? "Adding..." : `Add ${searchInput.toUpperCase()}`}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// import { useState, useEffect, useRef } from "react";
// import { fetchCryptos, addCrypto, searchCrypto } from "../services/api";
// import CryptoCard from "../components/CryptoCard";
// import { useNavigate } from "react-router-dom";
// import { RiLogoutBoxLine } from "react-icons/ri";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [cryptos, setCryptos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showPopup, setShowPopup] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [searching, setSearching] = useState(false);

//   const popupRef = useRef(null);
//   const searchInputRef = useRef(null);

//   const loadCryptos = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetchCryptos();

//       if (Array.isArray(res.data)) {
//         setCryptos(res.data);
//       } else {
//         setCryptos([]);
//       }
//     } catch (err) {
//       console.error("Fetch crypto error:", err);
//       setCryptos([]);
//       setError(err.response?.data?.message || "Failed to fetch crypto data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      Redirect if not logged in
//   ========================= */
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   /* =========================
//      Fetch user cryptos
//   ========================= */
//   useEffect(() => {
//     loadCryptos();
//   }, []);

//   /* =========================
//      LIVE SEARCH WITH DEBOUNCE
//   ========================= */
//   useEffect(() => {
//     const delay = setTimeout(async () => {
//       const q = searchInput.trim();

//       if (!q) {
//         setSuggestions([]);
//         setSearching(false);
//         return;
//       }

//       if (q.length < 3) {
//         setSuggestions([]);
//         setSearching(false);
//         return;
//       }

//       try {
//         setSearching(true);
//         const res = await searchCrypto(q);
//         setSuggestions(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Search failed:", err);
//         setSuggestions([]);
//       } finally {
//         setSearching(false);
//       }
//     }, 800);

//     return () => clearTimeout(delay);
//   }, [searchInput]);

//   /* =========================
//      Close popup on outside click
//   ========================= */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         closePopup();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* =========================
//      ADD CRYPTO
//   ========================= */
//   const handleAddCrypto = async (symbol) => {
//     const cryptoToAdd = (symbol || searchInput).trim();

//     if (!cryptoToAdd) {
//       setError("Please enter a cryptocurrency");
//       return;
//     }

//     setIsAdding(true);
//     setError("");

//     try {
//       const result = await addCrypto(cryptoToAdd);

//       if (result.data?.message === "Already added") {
//         closePopup();
//         return;
//       }

//       if (result.data?.success) {
//         await loadCryptos();
//         closePopup();
//         return;
//       }

//       throw new Error(result.data?.message || "Failed to add crypto");
//     } catch (err) {
//       console.error("Add crypto error:", err);
//       const errorMessage =
//         err.response?.data?.message || err.message || "Failed to add crypto";
//       setError(errorMessage);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   /* =========================
//      Enter key add
//   ========================= */
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddCrypto();
//     }
//   };

//   /* =========================
//      Close popup
//   ========================= */
//   const closePopup = () => {
//     setShowPopup(false);
//     setSearchInput("");
//     setSuggestions([]);
//     setSearching(false);
//     setError("");
//   };

//   /* =========================
//      Logout
//   ========================= */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Crypto Dashboard</h1>
//             <p className="text-gray-400">
//               Track your favorite ❤️ cryptocurrencies
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//           >
//             <RiLogoutBoxLine className="inline-block text-xl" /> Logout
//           </button>
//         </header>

//         {loading && (
//           <div className="text-center py-12 text-white">
//             <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2 rounded-full"></div>
//             <p>Loading your cryptocurrencies...</p>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-900 text-red-100 p-4 mb-4 rounded-lg">
//             <div className="flex justify-between">
//               <div>{error}</div>
//               <button onClick={() => setError("")}>×</button>
//             </div>
//           </div>
//         )}

//         {!loading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {cryptos.map((crypto) => (
//               <CryptoCard
//                 key={crypto.id}
//                 crypto={crypto}
//                 onDelete={async () => {
//                   await loadCryptos();
//                 }}
//               />
//             ))}

//             <div
//               className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48"
//               onClick={() => {
//                 setShowPopup(true);
//                 setTimeout(() => searchInputRef.current?.focus(), 100);
//               }}
//             >
//               <span className="text-white text-4xl">+</span>
//             </div>
//           </div>
//         )}

//         {showPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div ref={popupRef} className="bg-gray-800 rounded-xl p-6 w-80">
//               <h3 className="text-white font-bold mb-4">Add Cryptocurrency</h3>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAddCrypto();
//                 }}
//               >
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="bitcoin, ethereum, solana..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-3"
//                 />

//                 {searching && (
//                   <div className="text-sm text-gray-400 mb-2">Searching...</div>
//                 )}

//                 {suggestions.length > 0 && (
//                   <ul className="max-h-40 overflow-y-auto mb-3 space-y-1">
//                     {suggestions.map((coin) => (
//                       <li
//                         key={coin.id}
//                         onClick={() => {
//                           setSearchInput(coin.id);
//                           setSuggestions([]);
//                         }}
//                         className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white cursor-pointer"
//                       >
//                         <div className="flex justify-between">
//                           <span>{coin.name}</span>
//                           <span className="text-gray-400 text-sm">
//                             {coin.symbol.toUpperCase()}
//                           </span>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={!searchInput.trim() || isAdding}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
//                 >
//                   {isAdding ? "Adding..." : `Add ${searchInput.toUpperCase()}`}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





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









// import { useState, useEffect, useRef } from "react";
// import { fetchCryptos, addCrypto, searchCrypto } from "../services/api";
// import CryptoCard from "../components/CryptoCard";
// import { useNavigate } from "react-router-dom";
// import { RiLogoutBoxLine } from "react-icons/ri";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [cryptos, setCryptos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showPopup, setShowPopup] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [searching, setSearching] = useState(false);

//   const popupRef = useRef(null);
//   const searchInputRef = useRef(null);

//   const loadCryptos = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetchCryptos();

//       if (Array.isArray(res.data)) {
//         setCryptos(res.data);
//       } else {
//         setCryptos([]);
//       }
//     } catch (err) {
//       console.error("Fetch crypto error:", err);
//       setCryptos([]);
//       setError(err.response?.data?.message || "Failed to fetch crypto data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   useEffect(() => {
//     loadCryptos();
//   }, []);

//   useEffect(() => {
//     const delay = setTimeout(async () => {
//       const q = searchInput.trim();

//       if (!q) {
//         setSuggestions([]);
//         setSearching(false);
//         return;
//       }

//       if (q.length < 3) {
//         setSuggestions([]);
//         setSearching(false);
//         return;
//       }

//       try {
//         setSearching(true);
//         const res = await searchCrypto(q);
//         setSuggestions(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Search failed:", err);
//         setSuggestions([]);
//       } finally {
//         setSearching(false);
//       }
//     }, 800);

//     return () => clearTimeout(delay);
//   }, [searchInput]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         closePopup();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleAddCrypto = async (symbol) => {
//     const cryptoToAdd = (symbol || searchInput).trim();

//     if (!cryptoToAdd) {
//       setError("Please enter a cryptocurrency");
//       return;
//     }

//     setIsAdding(true);
//     setError("");

//     try {
//       const result = await addCrypto(cryptoToAdd);

//       if (result.data?.message === "Already added") {
//         await loadCryptos();
//         closePopup();
//         return;
//       }

//       if (result.data?.success) {
//         await loadCryptos();
//         closePopup();
//         return;
//       }

//       throw new Error(result.data?.message || "Failed to add crypto");
//     } catch (err) {
//       console.error("Add crypto error:", err);
//       const errorMessage =
//         err.response?.data?.message || err.message || "Failed to add crypto";
//       setError(errorMessage);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddCrypto();
//     }
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setSearchInput("");
//     setSuggestions([]);
//     setSearching(false);
//     setError("");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Crypto Dashboard</h1>
//             <p className="text-gray-400">
//               Track your favorite ❤️ cryptocurrencies
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//           >
//             <RiLogoutBoxLine className="inline-block text-xl" /> Logout
//           </button>
//         </header>

//         {loading && (
//           <div className="text-center py-12 text-white">
//             <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2 rounded-full"></div>
//             <p>Loading your cryptocurrencies...</p>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-900 text-red-100 p-4 mb-4 rounded-lg">
//             <div className="flex justify-between">
//               <div>{error}</div>
//               <button onClick={() => setError("")}>×</button>
//             </div>
//           </div>
//         )}

//         {!loading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {cryptos.map((crypto) => (
//               <CryptoCard
//                 key={crypto.id}
//                 crypto={crypto}
//                 onDelete={async () => {
//                   await loadCryptos();
//                 }}
//               />
//             ))}

//             <div
//               className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48"
//               onClick={() => {
//                 setShowPopup(true);
//                 setTimeout(() => searchInputRef.current?.focus(), 100);
//               }}
//             >
//               <span className="text-white text-4xl">+</span>
//             </div>
//           </div>
//         )}

//         {showPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div ref={popupRef} className="bg-gray-800 rounded-xl p-6 w-80">
//               <h3 className="text-white font-bold mb-4">Add Cryptocurrency</h3>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleAddCrypto();
//                 }}
//               >
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="bitcoin, ethereum, solana..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-3"
//                 />

//                 {searching && (
//                   <div className="text-sm text-gray-400 mb-2">Searching...</div>
//                 )}

//                 {suggestions.length > 0 && (
//                   <ul className="max-h-40 overflow-y-auto mb-3 space-y-1">
//                     {suggestions.map((coin) => (
//                       <li
//                         key={coin.id}
//                         onClick={() => {
//                           setSearchInput(coin.id);
//                           setSuggestions([]);
//                         }}
//                         className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white cursor-pointer"
//                       >
//                         <div className="flex justify-between">
//                           <span>{coin.name}</span>
//                           <span className="text-gray-400 text-sm">
//                             {coin.symbol.toUpperCase()}
//                           </span>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={!searchInput.trim() || isAdding}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
//                 >
//                   {isAdding ? "Adding..." : `Add ${searchInput.toUpperCase()}`}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// import { useState, useEffect, useRef } from "react";
// import { fetchCryptos, addCrypto, searchCrypto } from "../services/api";
// import CryptoCard from "../components/CryptoCard";
// import { useNavigate } from "react-router-dom";
// import { RiLogoutBoxLine } from "react-icons/ri";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [cryptos, setCryptos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showPopup, setShowPopup] = useState(false);
//   const [searchInput, setSearchInput] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [searching, setSearching] = useState(false);

//   const popupRef = useRef(null);
//   const searchInputRef = useRef(null);

//   /* =========================
//      Redirect if not logged in
//   ========================= */
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login");
//   }, [navigate]);

//   /* =========================
//      Load user cryptos
//   ========================= */
//   const loadCryptos = async () => {
//     setLoading(true);
//     try {
//       const res = await fetchCryptos();
//       setCryptos(Array.isArray(res.data) ? res.data : []);
//       setError("");
//     } catch (err) {
//       console.error("Fetch crypto error:", err);
//       setCryptos([]);
//       setError(err.response?.data?.message || "Failed to fetch crypto data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCryptos();
//   }, []);

//   /* =========================
//      Search suggestions from API
//   ========================= */
//   useEffect(() => {
//     const delay = setTimeout(async () => {
//       const query = searchInput.trim().toLowerCase();

//       if (!query) {
//         setSuggestions([]);
//         setSearching(false);
//         return;
//       }

//       if (query.length < 3) {
//         setSuggestions([]);
//         setSearching(false);
//         return;
//       }

//       try {
//         setSearching(true);
//         const res = await searchCrypto(query);
//         setSuggestions(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Search failed:", err);
//         setSuggestions([]);
//       } finally {
//         setSearching(false);
//       }
//     }, 800);

//     return () => clearTimeout(delay);
//   }, [searchInput]);

//   /* =========================
//      Close popup on outside click
//   ========================= */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         closePopup();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* =========================
//      Add crypto
//   ========================= */
//   const handleAddCrypto = async (symbol) => {
//     const cryptoToAdd = (symbol || searchInput.trim()).toLowerCase();

//     if (!cryptoToAdd) {
//       setError("Please enter a cryptocurrency");
//       return;
//     }

//     if (isAdding) return;

//     setIsAdding(true);
//     setError("");

//     try {
//       const result = await addCrypto(cryptoToAdd);

//       // If your addCrypto returns axios response, use result.data here instead.
//       if (result.success) {
//         await loadCryptos();
//         closePopup();
//       } else {
//         throw new Error(result.message || "Failed to add crypto");
//       }
//     } catch (err) {
//       console.error("Add crypto error:", err);

//       let errorMessage =
//         err.response?.data?.message || err.message || "Failed to add crypto";

//       if (err.response?.status === 429) {
//         errorMessage = "Too many requests. Please wait a few seconds.";
//       }

//       // refresh dashboard if coin already exists / already added
//       if (
//         errorMessage.toLowerCase().includes("exists") ||
//         errorMessage.toLowerCase().includes("already")
//       ) {
//         await loadCryptos();
//         closePopup();
//         setIsAdding(false);
//         return;
//       }

//       setError(errorMessage);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   /* =========================
//      Enter key add
//   ========================= */
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddCrypto();
//     }
//   };

//   /* =========================
//      Close popup
//   ========================= */
//   const closePopup = () => {
//     setShowPopup(false);
//     setSearchInput("");
//     setSuggestions([]);
//     setSearching(false);
//     setError("");
//   };

//   /* =========================
//      Logout
//   ========================= */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* HEADER */}
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">
//               Crypto Dashboard
//             </h1>
//             <p className="text-gray-400">
//               Track your favorite ❤️ cryptocurrencies
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//           >
//             <RiLogoutBoxLine className="inline-block text-xl" /> Logout
//           </button>
//         </header>

//         {/* LOADING */}
//         {loading && (
//           <div className="text-center text-white py-10">
//             Loading your cryptocurrencies...
//           </div>
//         )}

//         {/* ERROR */}
//         {error && (
//           <div className="bg-red-900 text-red-200 p-4 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {/* CRYPTO GRID */}
//         {!loading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {cryptos.map((crypto) => (
//               <CryptoCard
//                 key={crypto.id || crypto.symbol}
//                 crypto={crypto}
//                 onDelete={(deletedId) =>
//                   setCryptos((prev) =>
//                     prev.filter((c) => c.id !== deletedId)
//                   )
//                 }
//               />
//             ))}

//             {/* ADD CARD */}
//             <div
//               className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48"
//               onClick={() => {
//                 setShowPopup(true);
//                 setTimeout(() => searchInputRef.current?.focus(), 100);
//               }}
//             >
//               <span className="text-white text-4xl">+</span>
//             </div>
//           </div>
//         )}

//         {/* POPUP */}
//         {showPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div
//               ref={popupRef}
//               className="bg-gray-800 rounded-xl p-6 w-80"
//             >
//               <h3 className="text-lg font-bold text-white mb-4">
//                 Add Cryptocurrency
//               </h3>

//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="bitcoin, ethereum, solana..."
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
//                 onKeyDown={handleKeyDown}
//                 className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-3"
//               />

//               {searching && (
//                 <div className="text-sm text-gray-400 mb-2">Searching...</div>
//               )}

//               {suggestions.length > 0 && (
//                 <ul className="max-h-40 overflow-y-auto space-y-2 mb-3">
//                   {suggestions.map((coin) => (
//                     <li
//                       key={coin.id}
//                       onClick={() => {
//                         setSearchInput(coin.id.toLowerCase());
//                         setSuggestions([]);
//                       }}
//                       className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
//                     >
//                       {coin.name} ({coin.symbol.toUpperCase()})
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               <button
//                 onClick={() => handleAddCrypto()}
//                 disabled={!searchInput.trim() || isAdding}
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
//               >
//                 {isAdding ? "Adding..." : `Add ${searchInput}`}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect, useRef } from "react";
import { fetchCryptos, addCrypto, searchCrypto } from "../services/api";
import CryptoCard from "../components/CryptoCard";
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";

export default function Dashboard() {
  const navigate = useNavigate();

  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searching, setSearching] = useState(false);

  const popupRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const loadCryptos = async () => {
    setLoading(true);
    try {
      const res = await fetchCryptos();
      setCryptos(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Fetch crypto error:", err);
      setCryptos([]);
      setError(err.response?.data?.message || "Failed to fetch crypto data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCryptos();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      const query = searchInput.trim().toLowerCase();

      if (!query) {
        setSuggestions([]);
        setSearching(false);
        return;
      }

      if (query.length < 3) {
        setSuggestions([]);
        setSearching(false);
        return;
      }

      try {
        setSearching(true);
        const res = await searchCrypto(query);
        setSuggestions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Search failed:", err);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 800);

    return () => clearTimeout(delay);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCrypto = async (symbol) => {
    const cryptoToAdd = (symbol || searchInput.trim()).toLowerCase();

    if (!cryptoToAdd) {
      setError("Please enter a cryptocurrency symbol");
      return;
    }

    if (isAdding) return;

    setIsAdding(true);
    setError("");

    try {
      const result = await addCrypto(cryptoToAdd);

      if (result.data?.success) {
        await loadCryptos();
        closePopup();
        return;
      }

      throw new Error(result.data?.message || "Failed to add crypto");
    } catch (err) {
      console.error("Add crypto error:", err);

      let errorMessage =
        err.response?.data?.message || err.message || "Failed to add coin";

      if (err.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a few seconds.";
      }

      if (
        errorMessage.toLowerCase().includes("exists") ||
        errorMessage.toLowerCase().includes("already")
      ) {
        await loadCryptos();
        closePopup();
        return;
      }

      setError(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCrypto();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSearchInput("");
    setSuggestions([]);
    setSearching(false);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Crypto Dashboard
            </h1>
            <p className="text-gray-400">
              Track your favorite ❤️ cryptocurrencies
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <RiLogoutBoxLine className="inline-block text-xl" /> Logout
          </button>
        </header>

        {loading && (
          <div className="text-center text-white py-10">
            Loading your cryptocurrencies...
          </div>
        )}

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cryptos.map((crypto) => (
              <CryptoCard
                key={crypto.id || crypto.symbol}
                crypto={crypto}
                onDelete={(deletedId) =>
                  setCryptos((prev) =>
                    prev.filter((c) => c.id !== deletedId)
                  )
                }
              />
            ))}

            <div
              className="bg-gray-700/40 hover:bg-gray-600 cursor-pointer flex items-center justify-center rounded-xl h-48"
              onClick={() => {
                setShowPopup(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
            >
              <span className="text-white text-4xl">+</span>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              ref={popupRef}
              className="bg-gray-800 rounded-xl p-6 w-80"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Add Cryptocurrency
              </h3>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="bitcoin, ethereum, solana..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-3"
              />

              {searching && (
                <div className="text-sm text-gray-400 mb-2">Searching...</div>
              )}

              {suggestions.length > 0 && (
                <ul className="max-h-40 overflow-y-auto space-y-2 mb-3">
                  {suggestions.map((coin) => (
                    <li
                      key={coin.id}
                      onClick={() => {
                        setSearchInput(coin.id.toLowerCase());
                        setSuggestions([]);
                      }}
                      className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                    >
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleAddCrypto()}
                disabled={!searchInput.trim() || isAdding}
                className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
              >
                {isAdding ? "Adding..." : `Add ${searchInput}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}