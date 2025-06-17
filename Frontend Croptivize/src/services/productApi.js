import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "./customBaseQuery";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        addProduct: builder.mutation({
            query: (body) => {
                const formData = new FormData();
                Object.entries(body).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                return {
                    url: "/product/createProduct",
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["Product"],
        }),
        getProducts: builder.query({
            query: (params = {}) => {
                const {
                    page = 1,
                    limit = 10,
                    search = "",
                    category = "",
                    sort = "newest",
                    minPrice,
                    maxPrice,
                    minRating,
                    featured
                } = params;

                // Build the query string with all parameters
                let url = `/product/getProducts?page=${page}&limit=${limit}`;

                if (search) url += `&search=${encodeURIComponent(search)}`;
                if (category) url += `&category=${encodeURIComponent(category)}`;
                if (sort) url += `&sort=${sort}`;
                if (minPrice) url += `&minPrice=${minPrice}`;
                if (maxPrice) url += `&maxPrice=${maxPrice}`;
                if (minRating) url += `&minRating=${minRating}`;
                if (featured) url += `&featured=${featured}`;

                return {
                    url,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "GET",
                };
            },
            providesTags: ["Product"],
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/product/getProduct/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, body }) => {
                const formData = new FormData();
                Object.entries(body).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                return {
                    url: `/product/updateProduct/${id}`,
                    method: "PUT",
                    body: formData,
                }
            },
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/deleteProduct/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        addOrder: builder.mutation({
            query: (id) => ({
                url: `/product/addOrder/${id}`,
                method: "POST",
            })
        }),
        getOrders: builder.query({
            query: () => ({
                url: "/product/getOrders",
                method: "GET",
            }),
        }),
        getAnalytics: builder.query({
            query: () => ({
                url: "/product/analytics",
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
    }),
})

export const {
    useAddProductMutation,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useAddOrderMutation,
    useGetOrdersQuery,
    useGetAnalyticsQuery,
} = productApi