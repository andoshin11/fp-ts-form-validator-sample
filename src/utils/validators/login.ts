import { right, left } from "fp-ts/lib/Either";
import { validateErrorMap, Validator } from "@/lib/validation";

export type LoginForm = {
  username: string;
  password: string;
};

// username
const isUsernameLengthValid: Validator<LoginForm> = data =>
  data.username.length >= 2
    ? right(data)
    : left({ field: "username", error: "at least 2 characters" });

// password
const isPasswordLengthValid: Validator<LoginForm> = data =>
  data.password.length >= 6
    ? right(data)
    : left({ field: "password", error: "at least 6 characters" });

const isPasswordFormatValid: Validator<LoginForm> = data =>
  /[0-9]/g.test(data.password)
    ? right(data)
    : left({ field: "password", error: "at least one number" });

export const LoginFormValidator = validateErrorMap([
  isPasswordLengthValid,
  isPasswordFormatValid,
  isUsernameLengthValid,
]);
