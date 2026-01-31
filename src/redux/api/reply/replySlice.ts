import baseApi from "../baseApi";

export const allPlans = baseApi.injectEndpoints({
  endpoints: (builder) => ({


  reportReply: builder.mutation({
      query: (body) => ({
        url: "/reports/reply",
        method: "POST",
        body,
      }),
    }),

        getReportReplies: builder.query({
  query: ({ id, sort = "asc"}) =>
    `/reports/reply/${id}?sort=${sort}`,
  providesTags: ["Reports"],
}),

   sendReportReply: builder.mutation({
      query: (body) => ({
        url: "/reports/reply",
        method: "POST",
        body,
      }),
   
    }),



   
  }),
});

export const { 
 useReportReplyMutation,
   useGetReportRepliesQuery,
  useSendReportReplyMutation

 } = allPlans;
