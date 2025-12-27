import { Routes, Route } from "react-router-dom";

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
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import ProductsPage from "./pages/ProductsPage";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SucessPage";
import OrdersPage from "./pages/OrdersPage";
import UserCategories from "./pages/UserCategories";
import CategoryProducts from "./pages/CategoryProducts";
import AdminRoute from "./routes/AdminRoute";
import Layout from "./components/Layout";
import FeaturedProducts from "./pages/FeatureProducts";
import Contact from "./components/Contact"
import AdminLayout from "./components/AdminLayout";



export default function App() {
  return (

    <Routes>
      <Route
        path="/"
        element={
          <>
            <TopHeader />
            <Header />
            <Hero />
            <UserCategories />
            <ProductImage />
            <FeaturedProducts />
            <AboutUs />
            <FAQ />
            <Footer />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <TopHeader />
            <Header />
            <LoginPage />
            <Footer />
          </>
        }
      />

      <Route
        path="/otp"
        element={
          <>
            <TopHeader />
            <Header />
            <OtpPage />
            <Footer />
          </>
        }
      />

      <Route
        path="/signup"
        element={
          <>
            <TopHeader />
            <Header />
            <SignUp />
            <Footer />
          </>
        }
      />

      <Route path="/category" element={
        <Layout>
          <Categories />
        </Layout>
      } />
      <Route path="/sub-category" element={<>
        <Layout>
          <Subcategories />
        </Layout>
      </>} />

      <Route path="/products" element={
        <Layout>
          <Products />
        </Layout>

      } />
      <Route path="/products/new" element={<ProductForm />} />
      <Route path="/product" element={
        <Layout>
          <ProductsPage />
        </Layout>

      } />
      <Route path="/add-product" element={
        <Layout>
          <ProductForm />
        </Layout>

      } />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="/dashboard" element={
        <AdminRoute>
          <Dashboard />
        </AdminRoute>
      } />
      <Route path="/cart" element={

        <>
          <TopHeader />
          <Header />

          <CartPage />

          <Footer />
        </>

      } />
      <Route path="/checkout" element={
        <> 
        <TopHeader/>
        <Header/>
         <CheckoutPage />
         <Footer/>
         </>
      
        } />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/orders" element={<OrdersPage />} />


      <Route path="/categories" element={
        <Layout>
          <UserCategories />
        </Layout>

      }
      />
      <Route path="/category/:id" element={
        <>
          <TopHeader />
          <Header />
          <CategoryProducts />
          <Footer />
        </>

      } />

      <Route path="/product/:id" element={<ProductDetails />} />


      <Route path="/feature" element={<FeaturedProducts />} />
      <Route
        path="/contact"
        element={
          <>
            <TopHeader />
            <Header />
            <Contact />
            <Footer />
          </>
        }
      />


      <Route
        path="/productpage"
        element={
          <>
            <TopHeader />
            <Header />
            <ProductsPage />
            <Footer />
          </>
        }
      />
 <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="category" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>

    </Routes>

  );
}
