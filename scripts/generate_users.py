import uuid
import random
import argparse

def generate_users_sql(num_users, lon_min, lon_max, lat_min, lat_max, table_name="users"):
    sql_lines = [f"INSERT INTO {table_name} (id, priority, location_geom) VALUES"]

    values = []
    for _ in range(num_users):
        user_id = str(uuid.uuid4())
        lon = round(random.uniform(lon_min, lon_max), 6)
        lat = round(random.uniform(lat_min, lat_max), 6)
        values.append(f"('{user_id}', 0, ST_SetSRID(ST_MakePoint({lon}, {lat}), 4326)::geography)")

    sql_lines.append(",\n".join(values) + ";")
    return "\n".join(sql_lines)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate SQL for random users with geolocation.")
    parser.add_argument("--num_users", type=int, default=50, help="Number of users to generate")
    parser.add_argument("--lon_min", type=float, required=True, help="Minimum longitude")
    parser.add_argument("--lon_max", type=float, required=True, help="Maximum longitude")
    parser.add_argument("--lat_min", type=float, required=True, help="Minimum latitude")
    parser.add_argument("--lat_max", type=float, required=True, help="Maximum latitude")
    parser.add_argument("--table", type=str, default="users", help="Database table name")

    args = parser.parse_args()

    sql = generate_users_sql(args.num_users, args.lon_min, args.lon_max, args.lat_min, args.lat_max, args.table)
    print(sql)
