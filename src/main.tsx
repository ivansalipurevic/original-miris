import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App } from "./App";

import { CartProvider } from "./cart/CartContext";
import { ContactPage } from "./routes/ContactPage";
import { HomePage } from "./routes/HomePage";
import { PoliciesPage } from "./routes/PoliciesPage";
import { ProductDetailsPage } from "./routes/ProductDetailsPage";
import { ProductsPage } from "./routes/ProductsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage mode="all" /> },
      { path: "product/:handle", element: <ProductDetailsPage /> },
      { path: "collections/za-nju", element: <ProductsPage mode="za_nju" /> },
      { path: "collections/za-njega", element: <ProductsPage mode="za_njega" /> },
      { path: "contact", element: <ContactPage /> },
      { path: "policies/:slug", element: <PoliciesPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);

