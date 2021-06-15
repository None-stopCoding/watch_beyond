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

def count_gender(result):
    man_counter, woman_counter = 0, 0
    for inst in result.values():
        if inst['gender'] == 'Man':
            man_counter = man_counter + 1
        elif inst['gender'] == 'Woman':
            woman_counter = woman_counter + 1

    return {
        'Man': man_counter,
        'Woman': woman_counter
    }

def count_emotions(result):
    happy_counter, sad_counter, fear_counter, angry_counter,\
    disgust_counter, surprise_counter, neutral_counter = 0, 0, 0, 0, 0, 0, 0

    for inst in result.values():
        if inst['dominant_emotion'] == 'happy':
            happy_counter += 1
        elif inst['dominant_emotion'] == 'sad':
            sad_counter += 1
        elif inst['dominant_emotion'] == 'fear':
            fear_counter += 1
        elif inst['dominant_emotion'] == 'angry':
            angry_counter += 1
        elif inst['dominant_emotion'] == 'disgust':
            disgust_counter += 1
        elif inst['dominant_emotion'] == 'surprise':
            surprise_counter += 1
        elif inst['dominant_emotion'] == 'neutral':
            neutral_counter += 1

    return {
        'happy': happy_counter,
        'sad': sad_counter,
        'fear': fear_counter,
        'angry': angry_counter,
        'disgust': disgust_counter,
        'surprise': surprise_counter,
        'neutral': neutral_counter
    }

def count_ages(result):
    child_counter, teenager_counter, young_counter, adult_counter, old_counter = 0, 0, 0, 0, 0

    for inst in result.value():
        if inst['age'] < 10:
            child_counter += 1
        elif (inst['age'] >= 10) and (inst['age'] < 20):
            teenager_counter += 1;
        elif (inst['age'] >= 20) and (inst['age'] < 30):
            young_counter += 1
        elif (inst['age'] >= 30) and (inst['age'] < 40):
            adult_counter += 1
        else:
            old_counter += 1

    return {
        'child': child_counter,
        'teenager': teenager_counter,
        'young': young_counter,
        'adult': adult_counter,
        'old': old_counter
    }

def combining_categories(result):
    categories = {}
    categories['emotions'] = count_emotions(result)
    categories['ages'] = count_ages(result)
    categories['gender'] = count_gender(result)

    return categories

def max_values_of_categories(categories):
    