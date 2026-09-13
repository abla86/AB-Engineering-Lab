FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY main.go ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/eventforge-go-consumer .

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/eventforge-go-consumer /eventforge-go-consumer
USER nonroot:nonroot
ENTRYPOINT ["/eventforge-go-consumer"]
