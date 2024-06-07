export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Guest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  optIn?: boolean;
}

export type SignupUser = {
  zipCode?: string;
  birthday?: string;
  favoriteLocation?: number; // index of the option in dropdown
  optIn?: boolean;
  referralCode?: string;
  termsAndConditions?: boolean;
} & User;

export interface CreditCard {
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  zipCode: string;
}

export interface BrandConfig {
  name: string;
  ordering: {
    env: string;
    url: string;
  }[];
  id: string;
}
