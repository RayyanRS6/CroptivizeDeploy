import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import { diseaseApi } from "../services/diseaseApi";
import { productApi } from "../services/productApi";
import { messageApi } from "../services/messageApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [diseaseApi.reducerPath]: diseaseApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authApi.middleware,
        userApi.middleware,
        diseaseApi.middleware,
        productApi.middleware,
        messageApi.middleware
    ),
})

export default store