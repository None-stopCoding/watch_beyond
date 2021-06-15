from deepface import DeepFace
from utils import Dir, get_max_category_combined


def analyze_categories(img_path, actions):
    result = DeepFace.analyze(
        img_path=Dir.get_images(img_path),
        actions=actions
    )

    return result


def combine_categories(result):
    """
    Формирует данные для каждого признака отдельно по категориям
    """
    def get_range_for_age(age):
        """
        Определяет возрастной интервал
        """
        range_gap = 10
        for ranged in range(0, 100, range_gap):
            if age <= ranged:
                return f'{ranged}-{ranged + range_gap}'

    # Подготавливаем сырые данные, приводим к общему виду
    analysis = []
    for inst in result.values():
        categories = {}
        for attr, raw_value in inst.items():
            value = raw_value
            if attr == 'age':
                value = get_range_for_age(raw_value)

            if 'dominant' in attr:
                categories[attr.replace('dominant_', '')] = inst[attr]
            elif attr not in categories:
                categories[attr] = value

        analysis.append(categories)

    combined_analysis = {}
    for inst in analysis:
        for attr, value in inst.items():
            if attr in combined_analysis:
                attribute = combined_analysis[attr]
                attribute[value] = 1 if value not in attribute else attribute[value] + 1
            else:
                combined_analysis[attr] = {value: 1}

    return combined_analysis


def combine_attributes(combined_categories):
    combined_attributes = []
    for attr, values in combined_categories.items():
        combined_attributes.append(get_max_category_combined(values))

    return combined_attributes
