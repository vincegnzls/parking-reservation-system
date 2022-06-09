/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import { User } from "../../entities/User"
import { IContext } from "../../utils/types"
import Cookie from "js-cookie"

@ObjectType()
class FieldError {
  @Field()
  field?: string
  @Field()
  message?: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]
  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async registerUser(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() context: IContext
  ): Promise<User> {
    const user = await User.create({
      firstName,
      lastName,
      username,
      password,
    }).save()

    Cookie.set("userId", user.userId.toString())

    return user
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() context: IContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username } })

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username does not exist.",
          },
        ],
      }
    }

    if (password !== user.password) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password.",
          },
        ],
      }
    }

    Cookie.set("userId", user.userId.toString())

    return { user }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: IContext): Promise<boolean> {
    Cookie.remove("userId")

    return true
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: IContext): Promise<User | null> {
    let userId: any = 1

    console.log("MEEEEEEEE69", context.req.cookies)

    if (!userId) {
      return null
    } else {
      userId = parseInt(userId)
    }

    return await User.findOneOrFail({ where: { userId: parseInt(userId) } })
  }

  @Query(() => User)
  async getUser(@Arg("userId") userId: number): Promise<User> {
    return await User.findOneOrFail({ where: { userId } })
  }
}
