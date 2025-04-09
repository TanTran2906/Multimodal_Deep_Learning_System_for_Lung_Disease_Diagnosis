// src/features/store.js
import { configureStore } from "@reduxjs/toolkit";

// Thêm reducers vào đây
export const store = configureStore({
    reducer: {
        // your reducers
    },
});

export default store;
