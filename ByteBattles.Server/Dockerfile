# Build stage
FROM --platform=linux/amd64 mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files
COPY src/ByteBattles.Core/ByteBattles.Core.csproj src/ByteBattles.Core/
COPY src/ByteBattles.Application/ByteBattles.Application.csproj src/ByteBattles.Application/
COPY src/ByteBattles.Infrastructure/ByteBattles.Infrastructure.csproj src/ByteBattles.Infrastructure/
COPY src/ByteBattles.API/ByteBattles.API.csproj src/ByteBattles.API/

# Restore dependencies
RUN dotnet restore src/ByteBattles.API/ByteBattles.API.csproj

# Copy all source code
COPY . .

# Build
RUN dotnet build src/ByteBattles.API/ByteBattles.API.csproj -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish src/ByteBattles.API/ByteBattles.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM --platform=linux/amd64 mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://+:5057
ENV ASPNETCORE_ENVIRONMENT=Development

EXPOSE 5057

ENTRYPOINT ["dotnet", "ByteBattles.API.dll"]

