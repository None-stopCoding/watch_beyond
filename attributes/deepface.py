from deepface import DeepFace
from utils import Dir, get_max_category_combined
from pprint import pprint


# def combined_analysis(img_path):
#     categories = analyze_categories(img_path)
#     return get_max_category_combined(categories)


def analyze_categories(img_path, actions):
    result = DeepFace.analyze(
        img_path=Dir.get_images(img_path),
        actions=actions
    )

    return result

    # man_counter, woman_counter = 0, 0
    # for inst in result.values():
    #     if inst['gender'] == 'Man':
    #         man_counter = man_counter + 1
    #     elif inst['gender'] == 'Woman':
    #         woman_counter = woman_counter + 1
    #
    # return {
    #     'Man': man_counter,
    #     'Woman': woman_counter
    # }