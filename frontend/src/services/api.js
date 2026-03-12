// import axios from "axios";

// const API_BASE = "https://crypto-pulse-8dtn.onrender.com/api";

// export const signupUser= (data)=>axios.post(`${API_BASE}/signup`, data);
// export const loginUser= (data)=>axios.post(`${API_BASE}/login`, data);
// export const forgotPassword= (data)=>axios.post(`${API_BASE}/forgot-password`, data);
// export const verifyOTP = (data) => axios.post(`${API_BASE}/verify-otp`, data);
// export const fetchCryptos = () => {
//     const token = localStorage.getItem("token");
//     return axios.get(`${API_BASE}/cryptos`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
// };

// export const searchCrypto = (query) => {
//   const token = localStorage.getItem("token");
//   return axios.get(`${API_BASE}/cryptos/search?query=${encodeURIComponent(query)}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const deleteCrypto = async (symbol) => {
//   const token = localStorage.getItem("token");
//   try {
//     const response = await axios.delete(
//       `${API_BASE}/crypto/delete/${encodeURIComponent(symbol)}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response;
//   } catch (error) {
//     console.error('API Delete Error:', error);
//     throw error;
//   }
// };

// export const addCrypto = async (symbol) => {
//   const token = localStorage.getItem("token");
//   try {
//     const response = await axios.post(`${API_BASE}/crypto/add`,{symbol},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         validateStatus: (status) => status < 500
//       }
//     );
//     if (response.status >= 400) {
//       const error = new Error(response.data.message || 'Failed to add cryptocurrency');
//       error.response = response;
//       throw error;
//     }
//     return response.data;
//   } catch (err) {
//     console.error("API Error:", err);
//     throw err;
//   }
// };



// import axios from "axios";

// const API_BASE = "http://localhost:5000/api";

// export const signupUser = (data) =>
//   axios.post(`${API_BASE}/signup`, data);

// export const loginUser = (data) =>
//   axios.post(`${API_BASE}/login`, data);

// export const forgotPassword = (data) =>
//   axios.post(`${API_BASE}/forgot-password`, data);

// export const verifyOTP = (data) =>
//   axios.post(`${API_BASE}/verify-otp`, data);

// export const fetchCryptos = () => {
//   const token = localStorage.getItem("token");
//   return axios.get(`${API_BASE}/cryptos`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const searchCrypto = (query) => {
//   const token = localStorage.getItem("token");
//   return axios.get(`${API_BASE}/cryptos/search?query=${encodeURIComponent(query)}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const deleteCrypto = async (symbol) => {
//   const token = localStorage.getItem("token");
//   return axios.delete(`${API_BASE}/crypto/delete/${symbol}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const addCrypto = async (symbol) => {
//   const token = localStorage.getItem("token");

//   return axios.post(
//     `${API_BASE}/crypto/add`,
//     { symbol },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };






// import axios from "axios";

// // const API_BASE = "http://localhost:5000/api";
// const API_BASE = "/api";

// /* =========================
//    AUTH APIs
// ========================= */

// export const signupUser = (data) =>
//   axios.post(`${API_BASE}/signup`, data);

// export const loginUser = (data) =>
//   axios.post(`${API_BASE}/login`, data);

// export const forgotPassword = (data) =>
//   axios.post(`${API_BASE}/forgot-password`, data);

// export const verifyOTP = (data) =>
//   axios.post(`${API_BASE}/verify-otp`, data);

// /* =========================
//    CRYPTO APIs
// ========================= */

// export const fetchCryptos = () => {
//   const token = localStorage.getItem("token");

//   return axios.get(`${API_BASE}/cryptos`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const searchCrypto = (query) => {
//   const token = localStorage.getItem("token");

//   return axios.get(
//     `${API_BASE}/crypto/search?query=${encodeURIComponent(query)}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };

// export const deleteCrypto = (symbol) => {
//   const token = localStorage.getItem("token");

//   return axios.delete(`${API_BASE}/crypto/delete/${symbol}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const addCrypto = (symbol) => {
//   const token = localStorage.getItem("token");

//   return axios.post(
//     `${API_BASE}/crypto/add`,
//     { symbol },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };



// import axios from "axios";

// const API_BASE = "/api";

// const getAuthConfig = () => {
//   const token = localStorage.getItem("token");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// /* =========================
//    AUTH APIs
// ========================= */

// export const signupUser = (data) =>
//   axios.post(`${API_BASE}/signup`, data);

// export const loginUser = (data) =>
//   axios.post(`${API_BASE}/login`, data);

// export const forgotPassword = (data) =>
//   axios.post(`${API_BASE}/forgot-password`, data);

// export const verifyOTP = (data) =>
//   axios.post(`${API_BASE}/verify-otp`, data);

// /* =========================
//    CRYPTO APIs
// ========================= */

// export const fetchCryptos = () => {
//   return axios.get(`${API_BASE}/cryptos`, getAuthConfig());
// };

// export const searchCrypto = (query) => {
//   return axios.get(
//     `${API_BASE}/crypto/search?query=${encodeURIComponent(query)}`,
//     getAuthConfig()
//   );
// };

// export const deleteCrypto = (symbol) => {
//   return axios.delete(
//     `${API_BASE}/crypto/delete/${encodeURIComponent(symbol)}`,
//     getAuthConfig()
//   );
// };

// export const addCrypto = (symbol) => {
//   return axios.post(
//     `${API_BASE}/crypto/add`,
//     { symbol },
//     getAuthConfig()
//   );
// };





// import axios from "axios";

// const API_BASE = "/api";

// const getAuthConfig = () => {
//   const token = localStorage.getItem("token");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// export const signupUser = (data) =>
//   axios.post(`${API_BASE}/signup`, data);

// export const loginUser = (data) =>
//   axios.post(`${API_BASE}/login`, data);

// export const forgotPassword = (data) =>
//   axios.post(`${API_BASE}/forgot-password`, data);

// export const verifyOTP = (data) =>
//   axios.post(`${API_BASE}/verify-otp`, data);

// export const fetchCryptos = () => {
//   return axios.get(`${API_BASE}/cryptos`, {
//     ...getAuthConfig(),
//     params: { t: Date.now() }
//   });
// };

// export const searchCrypto = (query) => {
//   return axios.get(`${API_BASE}/crypto/search`, {
//     ...getAuthConfig(),
//     params: {
//       query,
//       t: Date.now()
//     }
//   });
// };

// export const deleteCrypto = (symbol) => {
//   return axios.delete(
//     `${API_BASE}/crypto/delete/${encodeURIComponent(symbol)}`,
//     {
//       ...getAuthConfig(),
//       params: { t: Date.now() }
//     }
//   );
// };

// export const addCrypto = (symbol) => {
//   return axios.post(
//     `${API_BASE}/crypto/add`,
//     { symbol },
//     {
//       ...getAuthConfig(),
//       params: { t: Date.now() }
//     }
//   );
// };




import axios from "axios";

const API_BASE = "/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================
   AUTH APIs
========================= */

export const signupUser = (data) =>
  axios.post(`${API_BASE}/signup`, data);

export const loginUser = (data) =>
  axios.post(`${API_BASE}/login`, data);

export const forgotPassword = (data) =>
  axios.post(`${API_BASE}/forgot-password`, data);

export const verifyOTP = (data) =>
  axios.post(`${API_BASE}/verify-otp`, data);

/* =========================
   CRYPTO APIs
========================= */

export const fetchCryptos = () => {
  return axios.get(`${API_BASE}/cryptos`, {
    ...getAuthConfig(),
    params: { t: Date.now() }
  });
};

export const searchCrypto = (query) => {
  return axios.get(`${API_BASE}/crypto/search`, {
    ...getAuthConfig(),
    params: {
      query,
      t: Date.now()
    }
  });
};

export const deleteCrypto = (symbol) => {
  return axios.delete(
    `${API_BASE}/crypto/delete/${encodeURIComponent(symbol)}`,
    {
      ...getAuthConfig(),
      params: { t: Date.now() }
    }
  );
};

export const addCrypto = (symbol) => {
  return axios.post(
    `${API_BASE}/crypto/add`,
    { symbol },
    {
      ...getAuthConfig(),
      params: { t: Date.now() }
    }
  );
};