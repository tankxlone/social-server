import { apiSlice } from "./apiSlice";
const POSTS_URL = "/api/posts";
const UPLOAD_URL = '/api/uploads';

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listNewsFeed: builder.query({
      query: (id) => ({
        url: `${POSTS_URL}/feed/${id}`
      }),
      providesTags: ['Post'],
      keepUnusedDataFor: 5,
    }),
    listByUser: builder.query({
      query: (id) => ({
        url: `${POSTS_URL}/by/${id}`
      }),
      providesTags: ["Post"],
      keepUnusedDataFor: 5,
    }),
    createPost: builder.mutation({
      query: (data) => {

        // Extract the id from formData
        const id = data.formData.get('id');
        return {

          url: `${POSTS_URL}/new/${id}`,
          method: 'POST',
          body: data.formData,
        };
      },
      invalidatesTags: ['Post'],
    }),
    uploadPostImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `${POSTS_URL}/${postId}`,
        method: 'DELETE',
      }),
    }),
    likePost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/like`,
        method: 'PUT',
        body: data,
      })
    }),
    unlikePost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/unlike`,
        method: 'PUT',
        body: data,
      })
    }),
    commentPost: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/comment`,
        method: 'PUT',
        body: data,
      })
    }),
    deleteComment: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/uncomment`,
        method: 'PUT',
        body: data,
      })
    })
  })
})

export const {
  useListNewsFeedQuery,
  useListByUserQuery,
  useCreatePostMutation,
  useUploadPostImageMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useCommentPostMutation,
  useDeleteCommentMutation,
} = postsApiSlice;
