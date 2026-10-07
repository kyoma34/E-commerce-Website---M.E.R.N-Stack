import { Route, Routes } from 'react-router-dom';
import HomePage         from './Pages/HomePage';
import Auth             from './Pages/auth';
import ShopPage         from './Pages/ShopPage';
import ProductPage      from './Pages/ProductPage';
import CartPage         from './Pages/CartPage';
import CheckoutPage     from './Pages/CheckoutPage';
import OrderConfirmPage from './Pages/OrderConfirmPage';

import AdminLayout   from './admin/Adminlayout';
import AdminOverview from './admin/Adminoverview';
import AdminProducts from './admin/Adminproducts';
import AdminUsers    from './admin/Adminusers';
import AdminOrders   from './admin/Adminorders';

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/"                    element={<HomePage />} />
      <Route path="/auth"                element={<Auth />} />
      <Route path="/shop"                element={<ShopPage />} />
      <Route path="/product/:id"         element={<ProductPage />} />
      <Route path="/cart"                element={<CartPage />} />
      <Route path="/checkout"            element={<CheckoutPage />} />
      <Route path="/order-confirm/:id"   element={<OrderConfirmPage />} />

      {/* admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index           element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users"    element={<AdminUsers />} />
        <Route path="orders"   element={<AdminOrders />} />
      </Route>
    </Routes>
  );
}