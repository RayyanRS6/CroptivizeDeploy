import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "./customBaseQuery";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: customBaseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/user/getUsers?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["User"],
        }),
        updateRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/user/updateUserRole/${userId}`,
                method: "PUT",
                body: { role },
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: (credentials) => ({
                url: `/user/updateProfile/`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),
        getUserCount: builder.query({
            query: () => ({
                url: "/user/count",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetUsersQuery, useUpdateRoleMutation, useUpdateUserMutation, useGetUserCountQuery } = userApi;