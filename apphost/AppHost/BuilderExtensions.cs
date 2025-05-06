using Microsoft.Extensions.DependencyInjection;

namespace AppHost
{
  internal static class BuilderExtensions
  {
    public static IResourceBuilder<NodeAppResource> AddNodeService(this IDistributedApplicationBuilder builder, string app, Dictionary<string, string> secrets)
    {
      var resource = new NodeAppResource(app, "yarn", ".");

      string healthBaseUrl;
      switch (app)
      {
        case "services-user-profile":
          healthBaseUrl = "http://localhost:3366";
          break;
        case "services-bff":
          healthBaseUrl = "http://localhost:3010/bff";
          break;
        case "api":
          healthBaseUrl = "http://localhost:4444";
          break;
        case "application-system-api":
          healthBaseUrl = "http://localhost:3333";
          break;
        default:
          throw new ArgumentException($"Unknown service: {app}");
      }

      builder.Services.AddHealthChecks().AddUrlGroup(new Uri($"{healthBaseUrl}/health/check"), name: app);

      var service = builder.AddResource(resource).WithArgs(["start", app])
          .WithEnvironment("NODE_TLS_REJECT_UNAUTHORIZED", "0")
          .WithHealthCheck(app);

      foreach (var secret in secrets)
      {
        service.WithEnvironment(secret.Key, secret.Value);
      }

      return service;
    }

    public static IResourceBuilder<NodeAppResource> AddDatabase(this IDistributedApplicationBuilder builder, string app)
    {
      var resource = new NodeAppResource($"start-dev-{app}", "yarn", ".");

      return builder.AddResource(resource).WithArgs(["dev-services", app]);
    }
  }
}
