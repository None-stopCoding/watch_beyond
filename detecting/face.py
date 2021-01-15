import cv2
import os


class Face:
    def __init__(self, path):
        self.face_cascade = None
        self.raw_path = os.getcwd() + path

    def get_images(self):
        cascade_path = os.getcwd() + '\\detecting\\haarcascade_frontalface_default.xml'
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        faces = []

        for image_file in os.listdir(self.raw_path):
            image = cv2.imread(self.raw_path + '\\' + image_file)
            faces.extend([(image, *[value for value in face_rect]) for face_rect in self.detect(image)])

        return faces

    def detect(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        return self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            maxSize=(50, 50),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

    @staticmethod
    def crop(width, height, image_rect):
        x, y, real_width, real_height = image_rect

        return x + (real_width - width) // 2 if real_width > width else x,\
               y + (real_height - height) // 2 if real_height > height else y,\
               width if real_width > width else real_width,\
               height if real_height > height else real_height,\
