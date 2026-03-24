import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostAd from "./pages/PostAd";
import AdDetail from "./pages/AdDetail";
import MyAds from "./pages/MyAds";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import FeaturedCheckout from "./pages/FeaturedCheckout";
import GoogleCallback from "./pages/GoogleCallback";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ad/:id" element={<AdDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route
              path="/post-ad"
              element={
                <ProtectedRoute>
                  <PostAd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-ads"
              element={
                <ProtectedRoute>
                  <MyAds />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/featured/:adId"
              element={
                <ProtectedRoute>
                  <FeaturedCheckout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
