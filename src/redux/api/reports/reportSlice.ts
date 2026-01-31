import baseApi from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getAllReports: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Add all parameters to the query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return `/reports${queryString ? `?${queryString}` : ""}`;
      },
      providesTags:["Reports"]
    }),
    // need to add types
    getAllPatients: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Add all parameters to the query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return `/auth/users${queryString ? `?${queryString}` : ""}`;
      },
      providesTags:['User']
    }),
 

    getAllStats: builder.query({
      query: () => "/analytics",
      providesTags: ["Stat"],
    }),

    getSingleReport: builder.query({
      query: (id) => `/reports/${id}`,
      providesTags: ["Stat","Reports"],
    }),

    deleteSingleReport: builder.mutation({
      query: (id) => `/reports/${id}`,
      invalidatesTags:["Reports","Stat"]
    }),


       UpdateResults: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reports/${id}/result`,
        method: 'PATCH',
        body:data
      }),
      invalidatesTags:["Reports","Stat"]
    }),

  }),
});

export const {
  useGetAllReportsQuery,
  useGetAllPatientsQuery,
  useGetAllStatsQuery,
  useGetSingleReportQuery,
 useUpdateResultsMutation
} = authApi;
