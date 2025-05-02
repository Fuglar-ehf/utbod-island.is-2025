using AppHost;
using DotNetEnv.Extensions;

var builder = DistributedApplication.CreateBuilder(args);

var secrets = DotNetEnv.Env.NoEnvVars().Load("../../.env.secret").ToDotEnvDictionary();

var redis = builder.AddContainer("redis", "redis/redis-stack", "latest")
    .WithHttpEndpoint(6379, 6379, "redis")
    .WithHttpEndpoint(8001, 8001, "redis-browser");

var userProfileDb = builder.AddDatabase("services-user-profile");
var userProfile = builder.AddNodeService("services-user-profile", secrets);

var api = builder.AddNodeService("api", secrets)
  /*.WaitFor(userProfile)*/;

var bff = builder.AddNodeService("services-bff", secrets)
  .WaitFor(redis);

var myPages = builder.AddResource(new NodeAppResource("service-portal", "yarn", "."))
    .WithEnvironment("NODE_TLS_REJECT_UNAUTHORIZED", "0")
    .WithHttpEndpoint(targetPort: 4200, isProxied: false)
    .WithArgs(["start", "service-portal"]);

myPages
  .WaitFor(api)
  .WaitFor(bff);

builder.Build().Run();
