using System.Reflection;
using MediatR.Pipeline;
using Reactivities_jason.Application.Common.Behaviours;
using Serilog;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        var logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();
        services.AddSerilog(logger);
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(RetryBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
            cfg.AddBehavior(typeof(IRequestPreProcessor<>), typeof(LoggingBehaviour<>));
        });
        // services.AddTransient(typeof(IPipelineBehavior<,>),typeof(RetryBehavior<,>));
        return services;
    }
}
