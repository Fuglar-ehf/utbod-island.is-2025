# Service provider’s role

The word **Service provider** is used here for the Icelandic term **Rekstraraðili**.

The authentication server is divided into three components:

- **Back-end**: Database. Contains user-data, client-data, API-data and authorization-provider data.
- **Identity provider**: The authentication-process. The authentication can be performed using various methods: with mobile, payment-card and Smart-ID amongst others.
- **Front-end**: The interface which the customer uses to connect to the system.

The service provider’s role is to ensure that these components are functioning correctly and maintaining them.

## IdentityServer

- While developing the authentication the service provider uses **IdentityServer** as a middleware.
- **IdentityServer** is a standardized software solution which takes care of the authentication, cooperating with the service provider’s solution in connecting users’ data through their clients with the resources’ data through APIs.

![service-provider-role/untitled.png](service-provider-role/untitled.png)
