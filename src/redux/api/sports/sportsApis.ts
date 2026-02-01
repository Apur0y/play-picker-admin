import baseApi from "../baseApi";

export const packagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getAllSports: builder.query({
      query: () => "/sports",
      providesTags: ["Sports"],
    }),


    getSportsById: builder.query({
      query: (id) => `/sports/${id}`,
      providesTags: ( id) => [{ type: "Plan", id }],
    }),


    createSport: builder.mutation({
      query: (body) => ({
        url: "/sports",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sports"],
    }),

    // ✅ UPDATE package
    updateSports: builder.mutation({
      query: ({ id, body }) => ({
        url: `/sports/${id}`,
        method: "PUT",
        body,
      }),
       invalidatesTags: ["Sports"]
    }),

    // ✅ DELETE package
    deleteSports: builder.mutation({
      query: (id) => ({
        url: `/sports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sports"],
    }),


  }),
});

export const {
  useGetAllSportsQuery,
  useCreateSportMutation,
  useDeleteSportsMutation,
  useUpdateSportsMutation,
  useGetSportsByIdQuery
 
} = packagesApi;
