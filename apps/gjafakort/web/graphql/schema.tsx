import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Application = {
  __typename?: 'Application'
  id?: Maybe<Scalars['String']>
  name: Scalars['String']
  email: Scalars['String']
  state: Scalars['String']
  companySSN: Scalars['String']
  serviceCategory?: Maybe<Scalars['String']>
  generalEmail: Scalars['String']
  webpage: Scalars['String']
  phoneNumber: Scalars['String']
  approveTerms?: Maybe<Scalars['Boolean']>
  companyName?: Maybe<Scalars['String']>
  companyDisplayName?: Maybe<Scalars['String']>
}

export type Article = {
  __typename?: 'Article'
  id: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  cta?: Maybe<ArticleCta>
  content: Scalars['String']
}

export type ArticleCta = {
  __typename?: 'ArticleCta'
  label: Scalars['String']
  url: Scalars['String']
}

export type Company = {
  __typename?: 'Company'
  ssn: Scalars['String']
  name: Scalars['String']
  application?: Maybe<Application>
}

export type CreateApplication = {
  __typename?: 'CreateApplication'
  application?: Maybe<Application>
}

export type CreateApplicationInput = {
  email: Scalars['String']
  generalEmail: Scalars['String']
  phoneNumber: Scalars['String']
  approveTerms: Scalars['Boolean']
  companySSN: Scalars['String']
  name: Scalars['String']
  serviceCategory: Scalars['String']
  webpage: Scalars['String']
  companyName: Scalars['String']
  companyDisplayName: Scalars['String']
  acknowledgedMuseum: Scalars['Boolean']
  exhibition: Scalars['Boolean']
  followingLaws: Scalars['Boolean']
  operatingPermitForVehicles: Scalars['Boolean']
  validLicenses: Scalars['Boolean']
  validPermit: Scalars['Boolean']
}

export type Form = {
  __typename?: 'Form'
  id: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  steps: Array<FormStep>
  postFlowContent?: Maybe<Scalars['String']>
}

export type FormStep = {
  __typename?: 'FormStep'
  id: Scalars['String']
  type: Scalars['String']
  title: Scalars['String']
  navigationTitle: Scalars['String']
  description: Scalars['String']
  options?: Maybe<Array<FormStepOption>>
  followups?: Maybe<Array<FormStepFollowup>>
}

export type FormStepFollowup = {
  __typename?: 'FormStepFollowup'
  id: Scalars['String']
  answer: Scalars['String']
  steps: Array<FormStep>
}

export type FormStepOption = {
  __typename?: 'FormStepOption'
  label: Scalars['String']
  value: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createApplication?: Maybe<CreateApplication>
  root?: Maybe<Scalars['String']>
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
}

export type Query = {
  __typename?: 'Query'
  article?: Maybe<Article>
  companies?: Maybe<Array<Maybe<Company>>>
  company?: Maybe<Company>
  form?: Maybe<Form>
  root?: Maybe<Scalars['String']>
}

export type QueryArticleArgs = {
  lang: Scalars['String']
  id: Scalars['String']
}

export type QueryCompanyArgs = {
  ssn: Scalars['String']
}

export type QueryFormArgs = {
  lang: Scalars['String']
  id: Scalars['String']
}

export type GetCompaniesQueryQueryVariables = {}

export type GetCompaniesQueryQuery = { __typename?: 'Query' } & {
  companies?: Maybe<
    Array<Maybe<{ __typename?: 'Company' } & Pick<Company, 'ssn' | 'name'>>>
  >
}

export type GetCompanyQueryQueryVariables = {
  ssn: Scalars['String']
}

export type GetCompanyQueryQuery = { __typename?: 'Query' } & {
  company?: Maybe<
    { __typename?: 'Company' } & Pick<Company, 'ssn' | 'name'> & {
        application?: Maybe<
          { __typename?: 'Application' } & Pick<
            Application,
            | 'id'
            | 'name'
            | 'email'
            | 'state'
            | 'companySSN'
            | 'serviceCategory'
            | 'generalEmail'
            | 'webpage'
            | 'phoneNumber'
            | 'approveTerms'
            | 'companyName'
            | 'companyDisplayName'
          >
        >
      }
  >
}

export type CreateApplicationMutationMutationVariables = {
  input: CreateApplicationInput
}

export type CreateApplicationMutationMutation = { __typename?: 'Mutation' } & {
  createApplication?: Maybe<
    { __typename?: 'CreateApplication' } & {
      application?: Maybe<
        { __typename?: 'Application' } & Pick<Application, 'id' | 'state'>
      >
    }
  >
}

export type GetArticleQueryQueryVariables = {}

export type GetArticleQueryQuery = { __typename?: 'Query' } & {
  article?: Maybe<
    { __typename?: 'Article' } & Pick<
      Article,
      'id' | 'title' | 'description' | 'content'
    >
  >
}

export const GetCompaniesQueryDocument = gql`
  query GetCompaniesQuery {
    companies {
      ssn
      name
    }
  }
`

/**
 * __useGetCompaniesQueryQuery__
 *
 * To run a query within a React component, call `useGetCompaniesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCompaniesQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >(GetCompaniesQueryDocument, baseOptions)
}
export function useGetCompaniesQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >(GetCompaniesQueryDocument, baseOptions)
}
export type GetCompaniesQueryQueryHookResult = ReturnType<
  typeof useGetCompaniesQueryQuery
>
export type GetCompaniesQueryLazyQueryHookResult = ReturnType<
  typeof useGetCompaniesQueryLazyQuery
>
export type GetCompaniesQueryQueryResult = ApolloReactCommon.QueryResult<
  GetCompaniesQueryQuery,
  GetCompaniesQueryQueryVariables
>
export const GetCompanyQueryDocument = gql`
  query GetCompanyQuery($ssn: String!) {
    company(ssn: $ssn) {
      ssn
      name
      application {
        id
        name
        email
        state
        companySSN
        serviceCategory
        generalEmail
        webpage
        phoneNumber
        approveTerms
        companyName
        companyDisplayName
      }
    }
  }
`

/**
 * __useGetCompanyQueryQuery__
 *
 * To run a query within a React component, call `useGetCompanyQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyQueryQuery({
 *   variables: {
 *      ssn: // value for 'ssn'
 *   },
 * });
 */
export function useGetCompanyQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >(GetCompanyQueryDocument, baseOptions)
}
export function useGetCompanyQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >(GetCompanyQueryDocument, baseOptions)
}
export type GetCompanyQueryQueryHookResult = ReturnType<
  typeof useGetCompanyQueryQuery
>
export type GetCompanyQueryLazyQueryHookResult = ReturnType<
  typeof useGetCompanyQueryLazyQuery
>
export type GetCompanyQueryQueryResult = ApolloReactCommon.QueryResult<
  GetCompanyQueryQuery,
  GetCompanyQueryQueryVariables
>
export const CreateApplicationMutationDocument = gql`
  mutation CreateApplicationMutation($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`
export type CreateApplicationMutationMutationFn = ApolloReactCommon.MutationFunction<
  CreateApplicationMutationMutation,
  CreateApplicationMutationMutationVariables
>

/**
 * __useCreateApplicationMutationMutation__
 *
 * To run a mutation, you first call `useCreateApplicationMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApplicationMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApplicationMutationMutation, { data, loading, error }] = useCreateApplicationMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateApplicationMutationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateApplicationMutationMutation,
    CreateApplicationMutationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateApplicationMutationMutation,
    CreateApplicationMutationMutationVariables
  >(CreateApplicationMutationDocument, baseOptions)
}
export type CreateApplicationMutationMutationHookResult = ReturnType<
  typeof useCreateApplicationMutationMutation
>
export type CreateApplicationMutationMutationResult = ApolloReactCommon.MutationResult<
  CreateApplicationMutationMutation
>
export type CreateApplicationMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateApplicationMutationMutation,
  CreateApplicationMutationMutationVariables
>
export const GetArticleQueryDocument = gql`
  query GetArticleQuery {
    article(lang: "is", id: "travelGift.info") {
      id
      title
      description
      content
    }
  }
`

/**
 * __useGetArticleQueryQuery__
 *
 * To run a query within a React component, call `useGetArticleQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticleQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetArticleQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetArticleQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetArticleQueryQuery,
    GetArticleQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetArticleQueryQuery,
    GetArticleQueryQueryVariables
  >(GetArticleQueryDocument, baseOptions)
}
export function useGetArticleQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetArticleQueryQuery,
    GetArticleQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetArticleQueryQuery,
    GetArticleQueryQueryVariables
  >(GetArticleQueryDocument, baseOptions)
}
export type GetArticleQueryQueryHookResult = ReturnType<
  typeof useGetArticleQueryQuery
>
export type GetArticleQueryLazyQueryHookResult = ReturnType<
  typeof useGetArticleQueryLazyQuery
>
export type GetArticleQueryQueryResult = ApolloReactCommon.QueryResult<
  GetArticleQueryQuery,
  GetArticleQueryQueryVariables
>
