import psycopg2


def decorated_connect(decorate_function):
    def connect(*args):
        connection = psycopg2.connect(
                            host = "localhost",
                            database = "wb",
                            user = "postgres",
                            password = "postgres")

        cur = connection.cursor()
        decorate_function(cur, *args)
        connection.commit()
        cur.close()
        connection.close()
    return connect

@decorated_connect
def add_custom_models(cur, *args):
    cur.execute("call public.addCustomModels(%s, %s, %s)", (args[0], args[1], args[2]))


add_custom_models('main.py', 'path', 1)

