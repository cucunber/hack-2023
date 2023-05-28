import pandas as pd
import requests
import warnings
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

warnings.filterwarnings("ignore")


def load_data(method='url', url='http://django:8000/api/hall/', data_dict={}):
    '''
    Загружает данные для рекомендательного модуля.

    Параметры:
                method(string): два варианта (url или dict).
                Определяет как загрузить данные - через api или из словаря

                url(string):
                Если выбран method 'url', пытается получить данные в формате json по указанному адресу.
                По умолчанию ищет тут 'http://127.0.0.1:8000/api/hall/'.

                data_dict(dict):
                Если выбран method 'dict', пытается получить данные из словаря.


    Возвращаемое значение:
                data(pd.DataFrame): возвращает pandas-датафрейм
    '''
    if method == 'url':
        try:
            r = requests.get(url)
            data = pd.DataFrame(r.json()['results'])
            while r.json()['next']:
                r = requests.get(r.json()['next'])
                data = pd.concat([data, pd.DataFrame(r.json()['results'])])
        except:
            print(f'Данные по endpoint {url} получить не удалось')
    elif method == 'dict':
        try:
            data = pd.DataFrame(data_dict)
        except:
            print(f'Проблема со словарем для создания датафрейма')
    else:
        print('Выбран некорректный метод загрузки данных. Корректные: url или dict')

    try:

        data['hall_type'] = data['hall_type'].apply(lambda x: sorted(x)).astype('string')
        return data
    except:
        print('Проблема с признаком hall_type, возможно, он отсутствует')


def choose_data(hall_id, all_data):
    '''
    Выбирает площадки того же типа. В процессе обработки раскрываются свойства конкретного типа площадок.

    Параметры:
            hall_id(int): id площадки, для которой необходимо найти похожие

            all_data(pd.DataFrame):
            Все загруженные данные.

    Возвращаемое значение:
            data(pd.DataFrame): возвращает pandas-датафрейм, содержащий только площадки нужного типа.
    '''
    temp_data = all_data[all_data.hall_type == all_data.query('id == @hall_id')['hall_type'].values[0]].copy()
    if len(temp_data.iloc[0].properties) == 0:
        return temp_data
    try:
        temp_dict = {key.get('property_name'): [] for key in temp_data.iloc[0].properties}
        for row in temp_data.properties:
            for el in row:
                temp_dict[el['property_name']].append(el.get('property_value', None))
        new_data = pd.DataFrame(temp_dict)
        new_data.to_csv('temp.csv', index=False)
        new_data = pd.read_csv('temp.csv')
        temp_data.drop(columns=['properties'], inplace=True)
    except:
        print('Проблема выделения свойств объектов')
    return temp_data.join(new_data).reset_index(drop=True)


def recommender(hall_id, data, rec_num=5):
    '''
    Формирует рекомендации для выбранной площадки.

    Параметры:
                hall_id(int): id площадки, для которой будут построены рекомендации.

                data(pd.DataFrame): весь датафрейм с данными.

                rec_num(int): кол-во рекомендованных площадок. По умолчанию - 5.


    Возвращаемое значение:
                recommends(list): возвращает список id наиболее похожих площадок.
                Площадки отсортированы от более похожих к менее похожим.
    '''
    try:
        # отбираем только площадки того же типа
        test_data = choose_data(hall_id, data)
        test_data = test_data.reset_index(drop=True)
        # отбираем числовые поля
        # feats_list = ["area", "capacity", "rating", "price", "longitude", "latitude"]
        feats_list = ["area", "capacity", "price", "longitude", "latitude"]
        features = test_data[feats_list]
        #        numeric_columns = test_data.select_dtypes(include='number').columns
        #        features = test_data[numeric_columns]
        #        features.drop(columns=['id'], inplace=True)
        for feat in feats_list:
            if len(features[feat].isna()) == len(features[feat]):
                features.fillna(0, inplace=True)
            else:
                features[feat].fillna(features[feat].median(), inplace=True)
        columns = features.columns

        # нормализуем данные
        scaler = StandardScaler()
        features = pd.DataFrame(scaler.fit_transform(features), columns=columns)

        # задаем веса
        # numeric_weights = {}

        # вычисляем сходство между площадками на основе числовых признаков
        similarities = cosine_similarity(features)

        # формируем список рекомендаций
        all_similarities = []
        for i, row in test_data.iterrows():
            # выбор похожих площадками для каждого товара + исключаем саму площадки
            similar_indices = similarities[i].argsort()[::-1][1:]
            similar_ids = [test_data.iloc[idx]['id'] for idx in similar_indices]
            all_similarities.append(similar_ids[:rec_num])

        test_data['similarity_ids'] = all_similarities

        return test_data.query('id == @hall_id')['similarity_ids'].values[0]

    except Exception as err:
        print(err)
        print('Проблема формирования рекомендаций')

