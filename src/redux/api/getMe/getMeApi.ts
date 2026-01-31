import baseApi from "../baseApi";

export const getMe = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

     updatePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

   getSignedUrl: builder.query({
      query: ({ fileType, mimeType }) => ({
        url: `/uploads?fileType=${fileType}&mimeType=${mimeType}`,
        method: 'GET',
      }),
    }),

   updateStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/auth/users/status/${id}`,
        method: 'PATCH',
        body:data
      }),
      invalidatesTags:["User"]
    }),
  }),
});

export const { 
  useGetMeQuery, 
  useUpdatePasswordMutation,
  useGetSignedUrlQuery,
  useUpdateStatusMutation
 } = getMe;
