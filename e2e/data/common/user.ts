import { type SignupUser, type User, type Guest } from "../../types";

export const registeredUser: User = {
  email: "automated_tests@chowlyinc.com",
  password: "password1",
  firstName: "Automated",
  lastName: "Tests",
  phoneNumber: "(501) 291-3344",
};

export const registeredUser2: User = {
  email: "ehossain@koala.io",
  password: "15288101",
  firstName: "koala",
  lastName: "Tests",
  phoneNumber: "(501) 291-3344",
};

export const signupUserWithZipAndTerms: SignupUser = {
  ...registeredUser,
  email: `automated_tests_${Date.now()}@chowlyinc.com`,
  phoneNumber: "5012913344",
  zipCode: "10004",
  favoriteLocation: 1,
  termsAndConditions: true,
};

export const guestUser: Guest = {
  email: "ehoussain@chowlyinc.com",
  firstName: "Eftiar",
  lastName: "Automated Tests",
  phoneNumber: "(503) 291-3344",
};
