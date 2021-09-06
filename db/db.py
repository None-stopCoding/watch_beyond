import psycopg2


def connect():
    connection = psycopg2.connect(
                        host = "localhost",
                        database = "wb",
                        user = "postgres",
                        password = "postgres")

    cur = connection.cursor()

    cur.execute("select * from attributes")
    rows = cur.fetchall()

    for r in rows:
        print(f"id {r[0]} name {r[1]} icon {r[2]} moduleName {r[3]}")

    cur.close()

    connection.close()


if __name__ == "__main__":
    connect()
