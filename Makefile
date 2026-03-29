start:
	docker compose up --build

stop:
	docker compose down -v

restart:
	docker compose down -v
	docker compose up --build

gen-users:
	python scripts/generate_users.py --num_users 30 \
    --lon_min -82.789900 --lon_max -82.218789 \
    --lat_min 27.705799 --lat_max 28.174085
