def pipe(func):
    def wrapper(self, *args):
        func(self, *args)
        return self

    return wrapper
