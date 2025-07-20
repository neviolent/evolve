Данный проект является экземпляром недельной работы над клоном известной игры Rival Regions. Вы можете использовать его в качестве костяка для своей игры.

Проект состоит из 1 микросервиса:
1. Система авторизации посредством JWT-ключей (JWT-ключ находится в backend\microservices\auth\controllers\user_controller.go).

Проект состоит из двух частей:
1. frontend (написан на ReactJS)
2. backend. Шлюз на FastAPI, микросервисы - на Golang.
Для запуска backend используйте следующие команды:
1. cd backend\microservices\auth
2. cd backend\microservices\map
go run main.go
Можно обернуть микросервисы в Docker-контейнеры, Dockerfile подготовлены.
