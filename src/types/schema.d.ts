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
  register?: Maybe<Array<Error>>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Error = {
  __typename?: 'Error';
  path: Scalars['String'];
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
};


export type QueryHelloArgs = {
  name?: InputMaybe<Scalars['String']>;
};
