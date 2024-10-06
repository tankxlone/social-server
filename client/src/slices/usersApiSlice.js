import { apiSlice } from './apiSlice';
const USERS_URL = '/api/users';
const UPLOAD_URL = '/api/uploads';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data
      })
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      })
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data.formData
      }),
    }),
    uploadUserImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL
      }),
      providesTags: ["User"],
      // keepUnusedDataFor: 5,
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      // keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
    follow: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/follow`,
        method: 'PUT',
        body: data
      })
    }),
    unFollow: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/unfollow`,
        method: 'PUT',
        body: data
      })
    }),
    findPeople: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/findPeople/${userId}`,
      }),
      // keepUnusedDataFor: 60,
    })
  })
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useDeleteUserMutation,
  useProfileMutation,
  useUpdateUserMutation,
  useUploadUserImageMutation,
  useFollowMutation,
  useUnFollowMutation,
  useFindPeopleQuery,
} = usersApiSlice;
