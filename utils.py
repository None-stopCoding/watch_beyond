from datetime import date, timedelta
import os
from functools import reduce
from pprint import pprint


class Dir:
    @staticmethod
    def get_images(path):
        cur_path = f'{Dir.get_images_path()}/{path}'
        images = os.listdir(cur_path)
        return list(map(lambda img: f'{cur_path}/{img}', images))

    @staticmethod
    def get_images_path():
        return 'data/images'

    @staticmethod
    def get_analysis_path():
        return 'data/analysis'


def pipe(func):
    def wrapper(self, *args):
        func(self, *args)
        return self

    return wrapper


def get_date(string_date):
    return date(*list(map(int, reversed(string_date.split('.')))))


def create_timeline(date_from, date_to, period):
    start = get_date(date_from)
    end = get_date(date_to)

    timeline = [start]
    while timeline[-1] < end:
        timeline.append(timeline[-1] + timedelta(**{period: 1}))

    return [line_date.strftime('%d.%m.%Y') for line_date in timeline]


def get_max_category_combined(categories):
    return reduce(
        lambda result, category: result if result['value'] > category[1] else {
            'value': category[1],
            'category': category[0]
        },
        categories.items(),
        {
            'value': 0,
            'category': 'Unknown'
        }
    )
