import { Length } from "class-validator"
import { Field, InputType } from "type-graphql"
import { IsUserAlreadyExist } from "../validators/isUserAlreadyExist"

@InputType()
export class RegisterInput {
  @Length(2, 20)
  @Field()
  firstName!: string

  @Length(2, 20)
  @Field()
  lastName!: string

  @Length(2, 20)
  @IsUserAlreadyExist({ message: "User already exists." })
  @Field()
  email!: string

  @Length(2, 20)
  @Field()
  password!: string
}
