# --- Этап сборки ---
FROM golang:1.24 AS builder

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем go.mod и go.sum и скачиваем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем весь проект
COPY . .

# Собираем бинарник с именем politsim
RUN go build -o politsim main.go

# --- Финальный образ ---
FROM alpine:latest

# Устанавливаем необходимые библиотеки для запуска Go-бинарника
RUN apk add --no-cache libc6-compat

# Копируем бинарник из стадии сборки
COPY --from=builder /app/politsim /politsim

# Порт приложения
EXPOSE 8001

# Команда запуска
CMD ["/politsim"]
