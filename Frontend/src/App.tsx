import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopHeader from "./components/TopHeader";
import Header from "./components/Header";
import Hero from "./components/Hero";

import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import ProductImage from "./components/ProductImage";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <TopHeader />
              <Header />
              <Hero />
              <ProductImage/>
              <AboutUs/>
              <FAQ/>
              <Footer/>
            </>
          }
        />

        {/* Login */}
        <Route path="/login" element={
          <>
          <TopHeader/>
          <Header/>
          <LoginPage />
          <Footer/>
          </>
          } />

        {/* OTP */}
        <Route path="/otp" element={ <>
          <TopHeader/>
          <Header/>
          <OtpPage />
          <Footer/>
          </>} />

          <Route path="/signup" element={
            <>
             <TopHeader/>
          <Header/>
           <SignUp/>
           <Footer/>
            </>
            
           }/>
      </Routes>
    </BrowserRouter>
  );
}
