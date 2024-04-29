using Polly;

namespace Reactivities_jason.Application.Common.Behaviours
{
    public class RetryBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly int _retryCount;
        private readonly TimeSpan _delay;

        public RetryBehavior(int retryCount = 3, int delayMilliseconds = 100)
        {
            _retryCount = retryCount;
            _delay = TimeSpan.FromMilliseconds(delayMilliseconds);
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var policy = Policy.Handle<Exception>()
                .WaitAndRetryAsync(_retryCount, attempt => _delay, (exception, delay, retryCount, context) =>
                {
                    Console.WriteLine($"Retry attempt {retryCount} due to {exception.GetType().Name}. Delay: {delay}");
                });

            return await policy.ExecuteAsync(async () => await next());
        }
    }
}
