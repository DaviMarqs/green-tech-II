import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Páginas
import { Esqueci } from "./pages/esqueciSenha"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"

// Componentes
import { SidebarProvider } from "./components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"

// Layouts
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>
}

const publicRoutes = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot", element: <Esqueci /> },
]

const privateRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
]

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
  )
}

export default App
