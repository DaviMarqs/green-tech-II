import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { Dashboard } from "./pages/Dashboard";
import { Esqueci } from "./pages/esqueciSenha";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { CartProvider } from "./contexts/CartContext";
import Checkout from "./pages/Checkout";
import DetailsProduct from "./pages/DetailsProduct";
import MyOrders from "./pages/MyOrders";
import { Sell } from "./pages/Sell";
import Profile from "./pages/Profile";
import NotaFiscal from "./pages/NotaFiscal";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </SidebarProvider>
    </CartProvider>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}

const publicRoutes = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot", element: <Esqueci /> },
];

const privateRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/details-product/:id", element: <DetailsProduct /> },
  { path: "/sell", element: <Sell /> },
  { path: "/my-orders", element: <MyOrders /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/my-profile", element: <Profile /> },
  { path: "/my-orders/:id", element: <NotaFiscal /> },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PublicLayout>{route.element}</PublicLayout>}
          />
        ))}

        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<AuthLayout>{route.element}</AuthLayout>}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
