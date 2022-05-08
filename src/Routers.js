import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./containers/Dashboard/Dashboard";
import SignIn from "./containers/Pages/SignIn";
import SignUp from "./containers/Pages/SignUp";
import ForgotPassword from "./containers/Pages/ForgotPassword";
// import NotFound from "./NotFound";

import { useAppContext } from "./Lib/ContextLib";

function Routers() {
  const isAuthenticated = useAppContext().isAuthenticated;

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </>
      ) : (
        <>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="*" element={<Navigate to="/sign-in" replace />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </>
      )}
    </Routes>
  );
}

export default Routers;
