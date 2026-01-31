import baseApi from "../baseApi";

export const packagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getAllSports: builder.query({
      query: () => "/sports",
      providesTags: ["Sports"],
    }),


    getPackageById: builder.query({
      query: (id) => `/packages/${id}`,
      providesTags: (result, error, id) => [{ type: "Plan", id }],
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
    updatePackage: builder.mutation({
      query: ({ id, body }) => ({
        url: `/packages/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Plan",
        { type: "Plan", id },
      ],
    }),

    // ✅ DELETE package
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plan"],
    }),

     sendNewslatter: builder.mutation({
      query: (body) => ({
        url: "/newsletter/notify",
        method: "POST",
        body,
      }),
    }),

  }),
});

export const {
  useGetAllSportsQuery,
  useGetPackageByIdQuery,
  useCreateSportMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useSendNewslatterMutation
} = packagesApi;
