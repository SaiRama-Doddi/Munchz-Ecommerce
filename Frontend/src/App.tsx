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
import AddStock from "./pages/AddStock";
import StockList from "./pages/StockList";
import StockHistory from "./pages/StockHistory";
import AboutMain from "./pages/Aboutmain";
import AdminCoupons from "./pages/AdminCoupons";
import AddStockDetails from "./pages/AddStockDetails";
import StockDetails from "./pages/StockDetails";

import AddOfflineStock from "./pages/OfflineStockAdd";
import OfflineInventoryList from "./pages/OfflineInventoryList";
import AdminCompleteStock from "./pages/AdminCompleteStock";

import OrderSuccessPage from "./pages/OrderSuccessPage";
import UserOrders from "./pages/UserOrders";
import AdminReviews from "./pages/AdminReviews";
import SearchProducts from "./pages/SearchProducts";




export default function App() {
  return (
 <div className="pb-[70px] md:pb-0">
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

     
     
      <Route path="/product" element={
        <Layout>
          <ProductsPage />
        </Layout>

      } />
      
      <Route path="/product/:id" element={<ProductDetails />} />

      <Route path="/search" element={<SearchProducts />} />

      {/* <Route path="/dashboard" element={
        <AdminRoute>
          <Dashboard orders={[]} />


          
        </AdminRoute>
      } /> */}


      <Route path="/cart" element={

        <>
          <TopHeader />
          <Header />

          <CartPage />

          <Footer/>
        
        </>

      } />

        <Route path="/order-success" element={
          <>
            <TopHeader />
          <Header />
          <OrderSuccessPage />
               <Footer/>
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
<Route path="/user-orders" element={

        <>
          <TopHeader />
          <Header />

          <UserOrders/>

          <Footer/>
        
        </>

      } />

      <Route path="/AboutMain" element ={<>
            <TopHeader />
            <Header />
            <AboutMain />
            <Footer />
          </>}/>

{/* ADMIN ROUTES  */}


{/* ADMIN ROUTES */}
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>

    <Route path="dashboard" element={<Dashboard orders={[]} />} />

    <Route path="category" element={<Categories />} />
    <Route path="sub-category" element={<Subcategories />} />

    <Route path="products" element={<Products />} />
    <Route path="products/new" element={<ProductForm />} />
    <Route path="add-product" element={<ProductForm />} />
    <Route path="edit-product/:id" element={<EditProduct />} />

    <Route path="orders" element={<OrdersPage />} />
    <Route path="coupons" element={<AdminCoupons />} />
    <Route path="reviews" element={<AdminReviews />} />

    <Route path="stock-entry" element={<AddStockDetails />} />
    <Route path="stock-details" element={<StockDetails />} />
    <Route path="addstock" element={<AddStock />} />
    <Route path="inventory" element={<StockList />} />
    <Route path="history" element={<StockHistory productId={0} />} />

    <Route path="offline-add" element={<AddOfflineStock />} />
    <Route path="offline-inventory" element={<OfflineInventoryList />} />
    <Route path="complete-stock" element={<AdminCompleteStock />} />

  </Route>
</Route>



{/*  <Route path="/category" element={
        <Layout>
          <Categories />
        </Layout>
      } /> */}

{/*  <Route path="/sub-category" element={<>
        <Layout>
          <Subcategories />
        </Layout>
      </>} /> */}
{/* 
      <Route path="/products" element={
        <Layout>
          <Products />
        </Layout>

      } /> */}
     {/*  <Route path="/products/new" element={<ProductForm />} /> */}


{/* 
<Route path="/add-product" element={
        <Layout>
          <ProductForm />
        </Layout>

      } /> */}
      
     {/*  <Route path="/edit-product/:id" element ={<Layout><EditProduct /></Layout>}/> */}

    </Routes>

 </div> );
}