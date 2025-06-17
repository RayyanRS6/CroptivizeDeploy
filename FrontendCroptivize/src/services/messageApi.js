import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../utils/baseURL";

export const messageApi = createApi({
    reducerPath: "messageApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (body) => ({
                url: "/message/addMessage",
                method: "POST",
                body: body,
            }),
        }),
        getMessage: builder.query({
            query: (id) => ({
                url: `/message/getMessage/${id}`,
                method: "GET",
            }),
        }),
        getAllMessages: builder.query({
            query: () => ({
                url: "/message/getAllMessages",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                method: "GET",
            }),
        }),
    }),
})

export const { useSendMessageMutation, useGetMessageQuery, useGetAllMessagesQuery } = messageApi;