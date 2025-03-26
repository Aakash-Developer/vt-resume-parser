import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootRouter from "./router/RootRouter.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "./store/store.ts";
import { Provider } from 'react-redux'
import { Toaster } from "./components/ui/sonner.tsx";



const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </Provider>
  </StrictMode>
);
