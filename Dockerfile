FROM mcr.microsofr.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

#copy .scproj and resotre as distinct layers
COPY "Reactivities.sln" "Reactivities.sln"
COPY "API/API.csproj" "API/API.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Persistence/Persistence.csproj" "Persistence/Persistence.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"
RUN dotnet restore "Reactivities.sln"

#copy everything else build
COPY . .
RUN dotnet publish -C Release -o out

#build a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet","API.dll" ]