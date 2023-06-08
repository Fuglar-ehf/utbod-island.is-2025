# API Design Guide

This is the home of the API Design Guide published by Stafrænt Ísland as a best practice guide for API development. It should help synchronize the work between developers and make working together easier. The guide covers the relevant design principles and patterns to use so the consumer experience is enjoyable and consistent throughout APIs.

This guide is under constant review and updates will be made over time as new design patterns and styles are adopted.

All feedback is welcomed and encouraged to help make the guide better so please feel free to create pull requests.

## Content

- [Once-Only](once-only.md)
- [Resource Oriented Design](resource-oriented-design.md)
  - [Design flow](resource-oriented-design.md#design-flow)
  - [Resource](resource-oriented-design.md#resources)
- [Naming Conventions](naming-conventions.md)
  - [General](naming-conventions.md#general)
  - [Resources](naming-conventions.md#resources)
  - [Fields](naming-conventions.md#fields)
- [GraphQL Naming Conventions](graphql-naming-conventions.md)
  - [Case styles](graphql-naming-conventions.md#case-styles)
  - [Input objects naming conventions](graphql-naming-conventions.md#input-objects-naming-conventions)
  - [Query naming conventions](graphql-naming-conventions.md#query-naming-conventions)
  - [Mutation naming conventions](graphql-naming-conventions.md#mutation-naming-conventions)
  - [Integrating naming conventions into shared api](graphql-naming-conventions.md#integrating-naming-conventions-into-shared-api)
- [Data Definitions](data-definitions.md)
  - [Text encoding](data-definitions.md#text-encoding)
  - [JSON](data-definitions.md#json)
  - [National identifier](data-definitions.md#national-identifier)
  - [Language and currency](data-definitions.md#language-and-currency)
  - [Date and time](data-definitions.md#date-and-time)
  - [Timestamp data](data-definitions.md#timestamp-data)
- [Data transfer objects](data-transfer-objects.md)
- [Pagination](pagination.md)
  - [PageInfo](pagination.md#pageinfo)
  - [Pagination Query parameters](pagination.md#pagination-query-parameters)
  - [Monorepo library](pagination.md#monorepo-library)
- [Methods](methods.md)
  - [Methods mapping to HTTP verbs](methods.md#methods-mapping-to-http-verbs)
  - [Custom methods (RPC)](methods.md#custom-methods-rpc)
- [REST Request](rest-request.md)
  - [Query parameters](rest-request.md#query-parameters)
  - [Path parameters](rest-request.md#path-parameters)
- [REST Response](rest-response.md)
  - [General](rest-response.md#general)
  - [GET](rest-response.md#get)
  - [POST](rest-response.md#post)
  - [PUT](rest-response.md#put)
  - [PATCH](rest-response.md#patch)
  - [DELETE](rest-response.md#delete)
- [Errors](errors.md)
  - [Response Body](errors.md#response-body)
- [Documentation](documentation.md)
  - [Describe error handling](documentation.md#describe-error-handling)
  - [Provide feedback mechanism](documentation.md#provide-feedback-mechanism)
  - [Example](documentation.md#example)
  - [Setup example](documentation.md#setup-example)
- [Versioning](versioning.md)
  - [Version changes](versioning.md#version-changes)
  - [URLs](versioning.md#urls)
  - [Increment version numbers](versioning.md#increment-version-numbers)
  - [Deprecating API versions](versioning.md#deprecating-api-versions)
- [Security](security.md)
- [Environments](environments.md)
  - [Development](environments.md#development-environment)
  - [Test](environments.md#test-environment-for-providers-of-an-api)
  - [Sandbox](environments.md#sandbox-environment-for-consumers-of-an-api)
  - [Production](environments.md#production-environment)
- [Example Service](example.md)

## Changelog

_Draft 4 - Published 2023-06-07_

- Updated usage of [HTTP status codes](rest-response.md#http-status-codes) to use `204` instead of `404` when resources are not found or not accessible to the user.
- Update [REST Requests](rest-request.md#working-with-sensitive-data) to describe arrays in query parameters and how to handle sensitive data in query and path parameters.
- Update [Custom Methods (RPC)](methods.md#custom-methods-rpc) to use verbs instead of nouns for method names with `POST`.

_Draft 3 - Published 2022-08-16_

- Improving [Documentation](documentation.md).
- Adding description of Content Types in [REST Response](rest-response.md).
- Making `hasPreviousPage` and `startCursor` optional in [Pagination](pagination.md).
- Adding OWASP and IAS reference in [Security](security.md).
- Other small fixes.

_Draft 2 - Published 2021-10-19_

- Changing pagination description

_Draft 1 - Published 2020-08-31_

- Initial relase
