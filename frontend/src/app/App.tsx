
// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import Layout from "../app/admin/Layout";
// // import PendingAdmin from "../app/admin/PendingAdmin";
// // import MedicineRequests from "../app/admin/MedicineRequests";
// // import Donations from "../app/admin/Donations";
// // import Settings from "../app/admin/Settings";
// // import Hospital from "../app/admin/Hospital";


// const App = () => {
//   const isAdminRoute = useLocation().pathname.startsWith("/admin");

//   return (
//     <>
     
//       {!isAdminRoute && <Layout />}

//       <Routes>
//         <Route path="/admin" element={<Layout/>}>
//           {/* <Route index element={<Dashboard />} /> */}
//           <Route path="/PendingAdmin" element={<PendingAdmin />} />
//           <Route path="/Hospital" element={<Hospital />} />
//           <Route path="/MedicineRequests" element={<MedicineRequests />} />
//           <Route path="/Donations" element={<Donations />} />
//           <Route path="/Settings" element={<Settings />} />
//         </Route>
//       </Routes>
//       {!isAdminRoute}
//     </>
//   );
// };

// export default App;
