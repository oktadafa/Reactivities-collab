# Part 1 - Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set working directory
WORKDIR /app

# Copy everything to the container
COPY . .

# Restore dependencies and publish the app
RUN dotnet restore "Reactivities-jason.sln"
RUN dotnet publish "Reactivities-jason.sln" -c Release -o /app/publish

# Part 2 - Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Set working directory
WORKDIR /app

# Copy the published app from the build stage
COPY --from=build /app/publish .

# Expose the port the app runs on
EXPOSE 8080

# Set the entry point for the container
ENTRYPOINT ["dotnet", "Reactivities_jason.Web.dll"]
