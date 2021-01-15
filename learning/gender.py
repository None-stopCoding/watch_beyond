from sklearn.ensemble import AdaBoostClassifier
import numpy as np

from utils import pipe
from detecting.face import Face

brightness = {}
classes = {}


class Data:
    def __init__(self, path):
        self.data = self.get_data(path)

    @staticmethod
    def get_data(path):
        return Face(path).get_images()

    def prepare(self):
        images = []
        for obj in self.data:
            image, *image_rect = obj
            x, y, width, height = Face.crop(25, 25, image_rect)
            classifiers = []

            for row in range(y, y + height):
                for index in range(x, x + width):
                    classifiers.extend(Data.calc_classifiers(image, x, y, width, height, row, index))

            images.append(classifiers)
        return images

    @staticmethod
    def calc_classifiers(image, x, y, width, height, cur_row, cur_index):
        classifiers = []

        for row in range(y, y + height):
            for index in range(x, x + width):
                if cur_row != row and cur_index != index:
                    classifiers.extend(Data.get_classes_for_pair(image[cur_row, cur_index], image[row, index]))

        return classifiers

    @staticmethod
    def get_classes_for_pair(current, neighbor):
        current = tuple(current)
        neighbor = tuple(neighbor)

        calculated = classes.get((current, neighbor), None)
        if not calculated:
            diff = Data.get_br(current) - Data.get_br(neighbor)
            abs_diff = abs(diff)
            params = [
                diff > 0,
                abs_diff < 5,
                abs_diff < 10,
                abs_diff < 25,
                abs_diff < 50
            ]

            calculated = [int(i) for i in params + [not x for x in params]]
            classes[(current, neighbor)] = calculated

        return calculated

    @staticmethod
    def get_br(pixel):
        if not brightness.get(pixel, None):
            brightness[pixel] = np.around(sum(pixel) / 3, 3)

        return brightness[pixel]


class Model:
    def __init__(self, input_data):
        self.model = None
        self.input = input_data
        self.create_model()

    @pipe
    def create_model(self):
        self.model = AdaBoostClassifier(n_estimators=100)

    @pipe
    def train(self, unreasonable_output):
        self.model.fit(self.input, unreasonable_output)

    def predict(self, input_for_predict):
        return self.model.predict(input_for_predict)
