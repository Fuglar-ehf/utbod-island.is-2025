using AppHost;
using DotNetEnv.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var secrets = DotNetEnv.Env.NoEnvVars().Load("../../.env.secret").ToDotEnvDictionary();
var secrets2 = DotNetEnv.Env.NoEnvVars().Load("../../../utbod-skatturinn-2025/.env.secret").ToDotEnvDictionary();

var redis = builder.AddContainer("redis", "redis/redis-stack", "latest")
    .WithHttpEndpoint(6379, 6379, "redis")
    .WithHttpEndpoint(8001, 8001, "redis-browser");

var skraDb = builder.AddDatabase("national-registry", "../../../utbod-skatturinn-2025");
var skra = builder.AddNodeService("national-registry", secrets2, "../../../utbod-skatturinn-2025");

var skatturinnDb = builder.AddDatabase("skatturinn-api", "../../../utbod-skatturinn-2025");
var skatturinn = builder.AddNodeService("skatturinn-api", secrets2, "../../../utbod-skatturinn-2025");

var userProfileDb = builder.AddDatabase("services-user-profile");
var userProfile = builder.AddNodeService("services-user-profile", secrets);

var api = builder.AddNodeService("api", secrets)
  .WaitFor(userProfile);

var bff = builder.AddNodeService("services-bff", secrets)
  .WaitFor(redis);

var applicationSystemDb = builder.AddDatabase("application-system-api");
var applicationSystemApi = builder.AddNodeService("application-system-api", secrets);

var myPages = builder.AddResource(new NodeAppResource("service-portal", "yarn", "."))
    .WithEnvironment("NODE_TLS_REJECT_UNAUTHORIZED", "0")
    .WithHttpEndpoint(targetPort: 4200, isProxied: false)
    .WithArgs(["start", "service-portal"]);

var applicationSystem = builder.AddResource(new NodeAppResource("application-system-form", "yarn", "."))
    .WithEnvironment("NODE_TLS_REJECT_UNAUTHORIZED", "0")
    .WithHttpEndpoint(targetPort: 4242, isProxied: false)
    .WithArgs(["start", "application-system-form"]);

myPages
  .WaitFor(api)
  .WaitFor(bff);

applicationSystem
  //.WaitFor(skra)
  //.WaitFor(skatturinn)
  .WaitFor(myPages);

builder.Build().Run();
