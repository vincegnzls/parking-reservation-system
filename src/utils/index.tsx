import React, { useEffect } from "react"
import { useRouter } from "next/router"
import { useLazyQuery, useQuery } from "@apollo/client"
import { ME } from "../queries"
import client from "../../apollo-client"

export const currencyFormat = (x: number) => {
  return x
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const toErrorMap = (errors: any[]) => {
  const errorMap: Record<string, string> = {}
  errors.forEach(({ field, message }) => {
    errorMap[field] = message
  })
  return errorMap
}

export function withAuth(gssp: any) {
  return async (context: any) => {
    const { error, data } = await client.query({
      query: ME,
      fetchPolicy: "no-cache",
    })

    if (!data.me) {
      return {
        redirect: {
          destination: "/login",
        },
      }
    }

    const gsspData = await gssp(context)

    if (gsspData.redirect) {
      return {
        redirect: {
          ...gsspData.redirect,
        },
      }
    }

    return {
      props: {
        ...gsspData.props,
        me: data.me,
      },
    }
  }
}

export function withoutAuth(gssp: any) {
  return async (context: any) => {
    const { error, data } = await client.query({
      query: ME,
      fetchPolicy: "no-cache",
    })

    if (data.me) {
      return {
        redirect: {
          destination: "/",
        },
      }
    }

    const gsspData = await gssp(context)

    if (gsspData.redirect) {
      return {
        redirect: {
          ...gsspData.redirect,
        },
      }
    }

    return {
      props: {
        ...gsspData.props,
        me: data.me,
      },
    }
  }
}

// export const withAuth = (Component: React.FC<any>) => {
//   const AuthenticatedComponent = () => {
//     const router = useRouter()
//     const [getMe, { data, loading }] = useLazyQuery(ME)

//     useEffect(() => {
//       const getUser = async () => {
//         const { data } = await getMe()
//         console.log("HAHA", data)

//         if (!data.me) {
//           router.push("/login", undefined, { shallow: true })
//         } else {
//           if (router.pathname === "/login") {
//             router.push("/", undefined, { shallow: true })
//           }
//         }
//       }

//       getUser()
//     }, [])

//     return loading ? null : <Component me={data?.me} />
//   }

//   return AuthenticatedComponent
// }

// export const withoutAuth = (Component: React.FC<any>) => {
//   const AuthenticatedComponent = () => {
//     const router = useRouter()
//     const [getMe, { data, loading }] = useLazyQuery(ME)

//     useEffect(() => {
//       getMe()
//     }, [])

//     useEffect(() => {
//       if (!loading) {
//         if (data?.me) {
//           router.push("/")
//         }
//       }
//     }, [data, loading])

//     return loading || data?.me ? null : <Component data={data?.me} />
//   }

//   return AuthenticatedComponent
// }
