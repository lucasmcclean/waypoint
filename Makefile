start:
	docker compose up --build

stop:
	docker compose down -v

restart:
	docker compose down -v
	docker compose up --build
