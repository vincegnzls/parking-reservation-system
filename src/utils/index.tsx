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
