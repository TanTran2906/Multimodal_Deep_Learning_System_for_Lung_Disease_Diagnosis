import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "./features/store";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppRoutes />
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);
