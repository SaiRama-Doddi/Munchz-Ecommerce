import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import TopHeader from "./components/TopHeader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductImage from "./components/ProductImage";
import AboutUs from "./components/AboutUs";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./routes/AdminRoute";
import PremiumSpinner from "./components/PremiumSpinner";

// Static imports for Home page core components (to maintain LCP)
import UserCategories from "./pages/UserCategories";
import FeaturedProducts from "./pages/FeatureProducts";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OtpPage = lazy(() => import("./pages/OtpPage"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Categories = lazy(() => import("./pages/Categories"));
const Subcategories = lazy(() => import("./pages/Subcategories"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const ProductForm = lazy(() => import("./pages/ProductForm"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const EditProduct = lazy(() => import("./pages/EditProduct"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const SuccessPage = lazy(() => import("./pages/SucessPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const Contact = lazy(() => import("./components/Contact"));
const AddStock = lazy(() => import("./pages/AddStock"));
const StockList = lazy(() => import("./pages/StockList"));
const StockHistory = lazy(() => import("./pages/StockHistory"));
const AboutMain = lazy(() => import("./pages/Aboutmain"));
const AdminCoupons = lazy(() => import("./pages/AdminCoupons"));
const AddStockDetails = lazy(() => import("./pages/AddStockDetails"));
const StockDetails = lazy(() => import("./pages/StockDetails"));
const AddOfflineStock = lazy(() => import("./pages/OfflineStockAdd"));
const OfflineInventoryList = lazy(() => import("./pages/OfflineInventoryList"));
const AdminCompleteStock = lazy(() => import("./pages/AdminCompleteStock"));
const AdminPayments = lazy(() => import("./pages/AdminPayments"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const UserOrders = lazy(() => import("./pages/UserOrders"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const SearchProducts = lazy(() => import("./pages/SearchProducts"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ReturnRefundPolicy = lazy(() => import("./pages/ReturnRefundPolicy"));
const ReferAndEarn = lazy(() => import("./pages/ReferAndEarn"));
const SubAdminManagement = lazy(() => import("./pages/SubAdminManagement"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));


export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
 <div className="pb-[70px] md:pb-0">
    <Suspense fallback={<PremiumSpinner text="Loading Munchz..." fullScreen={true} />}>
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
              <Testimonials />
              <BlogSection />
              <FAQ />
              <Footer />
              <FloatingActions />
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

        <Route path="/track" element={
          <TrackOrderPage />
        } />

        <Route path="/track/:shipmentId" element={
          <TrackingPage />
        } />


        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/blog" element={<BlogListPage />} />
        
        <Route path="/AboutMain" element ={<>
              <TopHeader />
              <Header />
              <AboutMain />
              <Footer />
            </>}/>

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
        <Route path="/refer-and-earn" element={<ReferAndEarn />} />

  {/* ADMIN ROUTES  */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="category" element={<Categories />} />
      <Route path="sub-category" element={<Subcategories />} />
      <Route path="products" element={<Products />} />
      <Route path="products/new" element={<ProductForm />} />
      <Route path="add-product" element={<ProductForm />} />
      <Route path="edit-product/:id" element={<EditProduct />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="payments" element={<AdminPayments />} />
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
      <Route path="sub-admins" element={<SubAdminManagement />} />
      <Route path="audit-logs" element={<AuditLogs />} />
    </Route>
  </Route>

      </Routes>
    </Suspense>
  </div> );
}