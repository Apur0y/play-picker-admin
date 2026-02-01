import baseApi from "../baseApi";

export const packagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET all packages
    getAllPackages: builder.query({
      query: () => "/packages",
      providesTags: ["Plan"],
    }),

    // ✅ GET single package by ID
    getPackageById: builder.query({
      query: (id) => `/packages/${id}`,
      providesTags: ( id) => [{ type: "Plan", id }],
    }),

    // ✅ CREATE new package
    createPackage: builder.mutation({
      query: (body) => ({
        url: "/packages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plan"],
    }),

    // ✅ UPDATE package
    updatePackage: builder.mutation({
      query: ({ id, body }) => ({
        url: `/packages/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ({ id }) => [
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
  useGetAllPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useSendNewslatterMutation
} = packagesApi;
