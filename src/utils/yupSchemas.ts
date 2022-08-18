import * as yup from "yup";
import {
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "../constants/errorMessages";

//Validator: validates field, used by schema
//schema: collection of validator

const passwordValidator = {
  password: yup.string().min(3, passwordNotLongEnough).max(255),
};

const emailValidator = {
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
};

export const userSchema = yup.object().shape({
  ...emailValidator,
  ...passwordValidator,
});
export const passwordSchema = yup.object().shape({
  ...passwordValidator,
});
export const emailSchema = yup.object().shape({
  ...emailValidator,
});
