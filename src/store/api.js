import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_ROOT = "https://dummyjson.com";

// This public demo API supplies read-only sample content; orders and user data
// must be connected to a real service before those features can be enabled.
export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_ROOT }),
  tagTypes: ["Product", "Category", "Post"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products?limit=0",
      transformResponse: (response) => response.products,
      providesTags: ["Product"],
    }),
    getCategories: builder.query({
      query: () => "/products/categories",
      providesTags: ["Category"],
    }),
    getProductsByCategory: builder.query({
      query: (argument) => {
        const slug = typeof argument === "string" ? argument : argument.slug;
        const limit = typeof argument === "string" ? 0 : (argument.limit ?? 0);
        return `/products/category/${encodeURIComponent(slug)}?limit=${limit}`;
      },
      transformResponse: (response) => response.products,
      providesTags: ["Product"],
    }),
    getAccessories: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const categoryResult = await baseQuery("/products/categories");
        if (categoryResult.error) return { error: categoryResult.error };
        if (!Array.isArray(categoryResult.data)) {
          return { error: { status: "CUSTOM_ERROR", error: "Invalid categories response." } };
        }

        const slugs = categoryResult.data
          .filter((category) => category?.slug?.includes("accessories"))
          .map((category) => category.slug);
        const results = await Promise.all(
          slugs.map((slug) =>
            baseQuery(`/products/category/${encodeURIComponent(slug)}?limit=0`),
          ),
        );
        const failed = results.find((result) => result.error);
        if (failed) return { error: failed.error };
        return { data: results.flatMap((result) => result.data?.products ?? []) };
      },
      providesTags: ["Product", "Category"],
    }),
    searchProducts: builder.query({
      query: ({ term, limit = 0 }) =>
        `/products/search?q=${encodeURIComponent(term)}&limit=${limit}`,
      transformResponse: (response) => response.products,
      providesTags: ["Product"],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getPosts: builder.query({
      query: () => "/posts?limit=12",
      transformResponse: (response) => response.posts,
      providesTags: ["Post"],
    }),
    getPost: builder.query({
      query: (id) => `/posts/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetAccessoriesQuery,
  useSearchProductsQuery,
  useGetProductQuery,
  useGetPostsQuery,
  useGetPostQuery,
} = storeApi;
