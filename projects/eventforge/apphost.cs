#:sdk Aspire.AppHost.Sdk@13.5.3
#:package Aspire.Hosting.Kafka@13.5.3
#:package Aspire.Hosting.PostgreSQL@13.5.3

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .AddDatabase("eventforge");

var kafka = builder.AddKafka("kafka");

var api = builder.AddDockerfile("api", "./api")
    .WithHttpEndpoint(port: 4100, targetPort: 4100, name: "http")
    .WithReference(postgres)
    .WithReference(kafka)
    .WaitFor(postgres)
    .WaitFor(kafka);

builder.AddDockerfile("go-consumer", "./consumers/go")
    .WithReference(kafka)
    .WaitFor(kafka);

builder.Build().Run();
