export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  sendConfirmEmailEmail?: Maybe<Scalars['Boolean']>;
  confirmEmail?: Maybe<Array<Error>>;
  login?: Maybe<Array<Error>>;
  logout?: Maybe<Scalars['Boolean']>;
  register?: Maybe<Array<Error>>;
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<Array<Error>>;
};


export type MutationConfirmEmailArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  id: Scalars['String'];
};

export type Error = {
  __typename?: 'Error';
  path: Scalars['String'];
  message: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  hello: Scalars['String'];
};


export type QueryHelloArgs = {
  name?: InputMaybe<Scalars['String']>;
};
