import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser,
  fetchUserAttributes,
  type SignInInput,
  type SignUpInput,
} from "aws-amplify/auth"
import { handleError } from "@/utils"

export type UserPublic = {
  email: string
  id: string
  full_name?: string | null
}

export type UserRegister = {
  email: string
  password: string
  full_name?: string | null
}

export type AccessToken = {
  username: string
  password: string
}

const isLoggedIn = async () => {
  try {
    await getCurrentUser()
    return true
  } catch {
    return false
  }
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const currentUser = await getCurrentUser()
        const attributes = await fetchUserAttributes()
        return {
          id: currentUser.userId,
          email: attributes.email || "",
          full_name: attributes.name || null,
        }
      } catch {
        return null
      }
    },
  })

  const signUpMutation = useMutation({
    mutationFn: async (data: UserRegister) => {
      const signUpData: SignUpInput = {
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.full_name || "",
          },
        },
      }
      return await signUp(signUpData)
    },
    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: (err: Error) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: AccessToken) => {
      const signInData: SignInInput = {
        username: data.username,
        password: data.password,
      }
      return await signIn(signInData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      navigate({ to: "/" })
    },
    onError: (err: Error) => {
      handleError(err)
    },
  })

  const logout = async () => {
    await signOut()
    queryClient.clear()
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn }
export default useAuth
