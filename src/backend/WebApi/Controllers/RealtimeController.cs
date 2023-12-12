using Microsoft.AspNetCore.Mvc;
using Supabase.Realtime;
using Supabase.Realtime.Models;
using Supabase.Realtime.Socket;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RealtimeController : ControllerBase
    {
        private bool initialized { get; set; } = false;
        private Client _client { get; set; }
        private Random random { get; set; }

        public RealtimeController()
        {
            random = new Random();

            Initialize();
        }

        private async Task Initialize()
        {
            var endpoint = "ws://realtime-dev-tenant.localhost:4000/socket";
            var client = new Client(endpoint, new ClientOptions
            {
                Parameters = new SocketOptionsParameters
                {
                    ApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzAyMjcwODAwLAogICJleHAiOiAxODYwMTIzNjAwCn0.6ViCvzQEOnacHHfmw8wFoATVrt6R6qFnX3sBnLe7PkU"
                }
            });

            client.AddDebugHandler((sender, message, exception) => Console.WriteLine(message));

            await client.ConnectAsync();

            _client = client;
            initialized = true;
        }

        [HttpGet(Name = "realtime")]
        public async Task<IActionResult> Get()
        {
            while (!initialized) {
                Thread.Sleep(1000);
            }

            // Shorthand for registering a postgres_changes subscription
            var channel = _client.Channel("test-channel");

            await channel.Subscribe();

            var data = new TestBroadcast { Event = "test_event", Payload = new CountStatus { Count = random.Next(0, 100) } };

            await channel.Send(Constants.ChannelEventName.Broadcast, "object", data);

            Console.WriteLine("never reaches here");

            return Ok();
        }
    }

    class TestBroadcast : BaseBroadcast<CountStatus> { }
    class CountStatus
    {
        public int Count { get; set; }
    }
}
