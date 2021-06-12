from datetime import date, timedelta
from pprint import pprint


def pipe(func):
    def wrapper(self, *args):
        func(self, *args)
        return self

    return wrapper


def create_timeline(date_from, date_to, period):
    start = date(*list(map(int, reversed(date_from.split('.')))))
    end = date(*list(map(int, reversed(date_to.split('.')))))
    delta_period = { period: 1 }

    timeline = [start]
    while timeline[-1] < end:
        timeline.append(timeline[-1] + timedelta(**delta_period))

    return [line_date.strftime('%d.%m.%Y') for line_date in timeline]


def prepare_images_path(path):
    return f'images/{path}'
