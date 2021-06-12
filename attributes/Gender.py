from pprint import pprint
from deepface import DeepFace
from utils import prepare_images_path


def combined_analysis(img_path):
    return analyze_categories(img_path)


def analyze_categories(img_path):
    res = DeepFace.analyze(img_path='./../images/first/01.05.21/1.jpg', actions=['gender', 'age'])
    pprint(res)
    return None


