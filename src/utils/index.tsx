import React, { useEffect } from "react"
import { useRouter } from "next/router"
import { useLazyQuery, useQuery } from "@apollo/client"
import { GET_USER, ME } from "../queries"
import client from "../../apollo-client"
import { getCookie } from "cookies-next"

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
    const userId = getCookie("userId", {
      req: context.req,
      res: context.res,
    })?.toString()

    const gsspData = await gssp(context)

    if (gsspData.redirect) {
      return {
        redirect: {
          ...gsspData.redirect,
        },
      }
    }

    if (userId) {
      const { error, data } = await client.query({
        query: GET_USER,
        variables: {
          userId: parseInt(userId),
        },
        fetchPolicy: "no-cache",
      })

      if (!data.getUser) {
        return {
          redirect: {
            destination: "/login",
          },
        }
      }

      return {
        props: {
          ...gsspData.props,
          me: data.getUser,
        },
      }
    } else {
      return {
        redirect: {
          destination: "/login",
        },
      }
    }
  }
}

export function withoutAuth(gssp: any) {
  return async (context: any) => {
    const userId = getCookie("userId", {
      req: context.req,
      res: context.res,
    })?.toString()

    const gsspData = await gssp(context)

    if (gsspData.redirect) {
      return {
        redirect: {
          ...gsspData.redirect,
        },
      }
    }

    if (userId) {
      const { error, data } = await client.query({
        query: GET_USER,
        variables: {
          userId: parseInt(userId),
        },
        fetchPolicy: "no-cache",
      })

      if (data.getUser) {
        return {
          redirect: {
            destination: "/",
          },
        }
      }

      return {
        props: {
          ...gsspData.props,
          me: data.getUser,
        },
      }
    }

    return {
      props: {
        ...gsspData.props,
      },
    }
  }
}
