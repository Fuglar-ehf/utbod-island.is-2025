# Documentation

API documentation should be targeted towards the developer that will consume the API.
A good documentation is one of the single most important qualities of an API as it
can significantly reduce the implementation time for the API consumers.
The API provider is responsible for keeping the documentation up to date.

To help with keeping documentation up to date consider using automatic generation
tools that during build time can, for example, gather comments in predefined syntax
and generate the [Open API Specification](https://swagger.io/specification/) (OAS),
this means that the OAS lives bundled with the code and should be easier for developers to maintain.

## Open Api Specification requirements for the API Catalogue

To be able to register a **REST** service to the _API Catalogue_ the service **MUST** provide an **OPENAPI 3** service description.

The following fields, not marked as (_Optional_), are required for services to be automatically imported to the _API Catalogue_:

- [`info`](https://spec.openapis.org/oas/v3.1.0#info-object)
  - description — short but proper description of the API.
  - version — to distinguish API versions following [semantic versioning](https://semver.org/) specification.
  - title — descriptive name of the API.
  - contact — information on who to contact about an issue with the service.
    - name — of the person or a department.
    - url (_Optional_) — containing information on the person or department to contact.
    - email — fully qualified email.
  - x-category — What kind of data does this service work with.
    - Possible values: `open`, `official`, `personal`, `health`, `financial`.
    - These values are displayed in the service view.
  - x-pricing — Cost of using this service.
    - Possible values: `free`, `paid`.
    - These values are displayed in the service view.
  - x-links — Links regarding the service.
    - responsibleParty — a fully qualified url to an online page containing information about the responsible party/owner of the service. This is linked to in the service view.
    - documentation — (_Optional_) a fully qualified url to the API documentation page. This is linked to in the service view.
    - bugReport (_Optional_) — a fully qualified url to an online page or form a consumer can report bugs about the service. This is linked to in the service view.
    - featureRequest (_Optional_) — a fully qualified url to an online page or form a consumer can ask for a new feature in api service. This is linked to in the service view.

An Open API Specification document MUST also describe the following:

- Uses the [`Example Object`](https://spec.openapis.org/oas/v3.1.0#example-object) to show example path and query parameters, request and response body for each operation.
- Documents all expected HTTP statuses in the [`Response Object`](https://spec.openapis.org/oas/v3.1.0#responses-object), both success and errors.
- Describes all the content types with a [`Media Type Object`](https://spec.openapis.org/oas/v3.1.0#media-type-object) for operations, both requests and responses.
- Orders the [`Parameter Objects`](https://spec.openapis.org/oas/v3.1.0#parameter-object) to list all required parameters before optional.
- Describes the operation's authentication using the [`Security Requirement Object`](https://spec.openapis.org/oas/v3.1.0#securityRequirementObject)
  or the [`Security Scheme Object`](https://spec.openapis.org/oas/v3.1.0#security-scheme-object) to set the API top-level security.
- Contains the `description` field for all operations, parameters, and schema fields to provide human readable documentation of the corresponding field.

Example can be found [here](documentation.md#example).

Setup example for NSwag in .NET core can be found [here](documentation.md#Setup-example).

This picture shows where each OpenApi extension (x-\*) is displayed or linked in the service view.
![openapi-extensions-map](assets/extensions_map.png)

## Describe error handling

Provide information on which HTTP status codes a client consuming your service can expect the API to return, and provide information on application defined errors and how the errors are presented to clients. See [Errors](errors.md) for further details.

## Provide feedback mechanism

Provide users with a way to comment on your documentation. This will help with finding concepts that need further explanation and keeping the documentation up to date.

The field x-links in the OpenAPI schema provides a way to include paths where consumers can provide feedback on the API.

## Example

```yaml
openapi: 3.0.3
servers:
  - url: https://development.my-service.island.is
    description: Development server
  - url: https://staging.my-service.island.is
    description: Staging server
  - url: https://production.my-service.island.is
    description: Production server
info:
  description: |-
    Provides access to an example service that retrieves individuals
  version: 0.0.1
  title: Example service
  termsOfService: ''
  contact:
    name: Digital Iceland
    url: https://stafraent.island.is/
    email: stafraentisland@fjr.is
  license:
    name: MIT
    url: 'https://opensource.org/licenses/MIT'
  x-pricing:
    - free
  x-category:
    - personal
    - official
  x-links:
    documentation: 'https://docs.my-service.island.is'
    responsibleParty: 'https://my-service.island.is/responsible'
    bugReport: 'https://github.com/island-is/island.is/issues/new'
    featureRequest: 'https://github.com/island-is/island.is/issues/new'
paths:
  /individuals:
    get:
      description: |
        Returns all individuals registered
      operationId: getIndividuals
      parameters:
        - name: dateOfBirth
          in: query
          description: Find all individuals born after set date
          required: false
          schema:
            type: string
            format: date
          examples:
            dateOfBirthExample:
              summary: Example of date of birth query parameter
              value: '1930-12-10'
      responses:
        '200':
          description: |
            Returns an array of individuals, either it returns all individuals or individuals born after a specific date
          content:
            application/json:
              schema:
                type: object
                properties:
                  individuals:
                    type: array
                    items:
                      $ref: '#/components/schemas/Individual'
              examples:
                individual:
                  $ref: '#/components/examples/IndividualsResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '500':
          $ref: '#/components/responses/InternalServerError'
        default:
          description: Unexpected error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    $ref: '#/components/schemas/Error'
      security:
        - auth:
            - '@myorg.is/individuals:read'
  /individuals/{id}:
    get:
      description: |
        Returns individual based on a single ID
      operationId: getIndividual
      parameters:
        - name: id
          in: path
          description: UUID of an individual
          required: true
          schema:
            type: string
            format: UUID
          examples:
            uuidExample:
              summary: Example of UUID parameter
              value: '0762e29f-edf9-4fb3-b324-4503e92a5033'
      responses:
        '200':
          description: |
            Returns an individual with a specific id
          content:
            application/json:
              schema:
                type: object
                properties:
                  individuals:
                    type: array
                    items:
                      $ref: '#/components/schemas/Individual'
              examples:
                individual:
                  $ref: '#/components/examples/IndividualResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
        '500':
          $ref: '#/components/responses/BadRequest'
      security:
        - auth:
            - '@myorg.is/individuals:read'
components:
  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
    NotFound:
      description: The specified resource was not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
    InternalServerError:
      description: The specified resource was not found
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                $ref: '#/components/schemas/Error'
  schemas:
    Individual:
      type: object
      properties:
        id:
          type: string
          description: Unique UUID
          format: UUID
        nationalId:
          type: string
          minLength: 12
          maxLength: 12
          pattern: '^\d{12}$'
          description: National security number
        firstName:
          type: string
          minLength: 1
          maxLength: 250
          description: First name and middle name
        lastName:
          type: string
          minLength: 1
          maxLength: 250
          description: Last name
        dateOfBirth:
          type: string
          format: date-time
          description: UTC date of birth
      example:
        id: 'BA84DAF1-DE55-40A8-BF35-8A76C7F936F6'
        nationalId: '160108117573'
        firstName: 'Quyn G.'
        lastName: 'Rice'
        dateOfBirth: '2019-03-29T18:00:58.000Z'
        address: '377-8970 Vitae Rd.'
    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: integer
        message:
          type: string
        errors:
          type: array
          items:
            $ref: '#/components/schemas/ErrorDetail'
      example:
        code: 400
        message: 'Bad request'
        errors:
          - code: 87
            message: 'Parameter is incorrectly formatted'
            help: 'https://www.moa.is/awesome/documetation/devices'
            trackingId: '5d17a8ada52a2327f02c6a1a'
            param: 'deviceId'
          - code: 85
            message: Parameter missing
            help: 'https://www.moa.is/awesome/documetation/devices'
    ErrorDetail:
      type: object
      required:
        - message
      properties:
        code:
          type: integer
        message:
          type: string
        help:
          type: string
        trackingId:
          type: string
        param:
          type: string
  examples:
    IndividualResponse:
      summary: Example of a response of a single individual
      value:
        id: '0762e29f-edf9-4fb3-b324-4503e92a5033'
        nationalId: '1234567890'
        firstName: 'Doctor'
        lastName: 'Strange'
        dateOfBirth: '1930-12-10T13:37:00.000Z'
        address: '535 West End Avenue at West 86th Street'

    IndividualsResponse:
      summary: Example of a response of array of individuals
      value:
        - id: '0762e29f-edf9-4fb3-b324-4503e92a5033'
          nationalId: '1234567890'
          firstName: 'Doctor'
          lastName: 'Strange'
          dateOfBirth: '1930-12-10T13:37:00.000Z'
          address: '535 West End Avenue at West 86th Street'
        - id: '68c78874-ff03-4ea6-b68d-ceba07286450'
          nationalId: '0987654321'
          firstName: 'Wanda'
          lastName: 'Maximoff'
          dateOfBirth: '1989-02-15T13:37:00.000Z'
          address: 'Sokovia'
  securitySchemes:
    auth:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://identityprovider.is/connect/authorize
          tokenUrl: https://identityprovider.is/connect/token
          scopes:
            '@myorg.is/individuals:read': Read access to the individual api.
            '@myorg.is/individuals:write': Write access to the individual api.
```

## Setup example

```text
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers();
	services.AddRouting(options => options.LowercaseUrls = true);

	services.AddOpenApiDocument(config =>
	{
		//Registers all the required information for the API catalogue
		config.PostProcess = document =>
		{
			//Basic information for the service, what it does and who is responsible for it
			document.Info.Version = "v1";
			document.Info.Title = "National Registry";
			document.Info.Description = "Provides access to an example service that retrieves individuals.";
			document.Info.Contact = new NSwag.OpenApiContact { Name = "Digital Iceland", Email = "stafraentisland@fjr.is", Url = "https://stafraent.island.is/" };

			//The extension fields specifically used for API catalogue to help filter services
			document.Info.ExtensionData = new Dictionary<string, object>();
			document.Info.ExtensionData.Add(new KeyValuePair<string, object>("x-category", new string[] { "personal", "official" }));
			document.Info.ExtensionData.Add(new KeyValuePair<string, object>("x-pricing", new string[] { "free", "paid" }));
			document.Info.ExtensionData.Add(new KeyValuePair<string, object>("x-links", new Dictionary<string, string>()
			{
				{ "documentation", "https://docs.my-service.island.is" },
				{ "responsibleParty", "https://www.skra.is/um-okkur" },
				{ "bugReport", "https://github.com/island-is/island.is/issues/new" },
				{ "featureRequest", "https://github.com/island-is/island.is/issues/new" },
			}));

		};
	});
}
```
