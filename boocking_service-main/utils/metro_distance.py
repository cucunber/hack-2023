from math import sqrt
from metro_stations_list import METRO_STATIONS


def find_station_diagonal(y, x, stations=METRO_STATIONS):
    """Вывод ближайшей станции метро, учитывая кратчайшее расстояние по диагонали
    Передаётся широта (y), вторая долгота (x)

    Параметры:
            y: координата широты (float)
            x: координата долготы (float)
            stations: список станций метро

    Возвращаемое значение:
            Название ближайшей станции в формате строки
            """

    try:
        min_distance = abs(sqrt((float(stations['Южная'][0]) - y) ** 2 + (float(stations['Южная'][1]) - x) ** 2))
        min_st = 'Южная'
        for st in stations:
            y1 = float(stations[st][0])
            x1 = float(stations[st][1])
            dist = abs(sqrt((y1 - y) ** 2 + (x1 - x) ** 2))
            if dist <= min_distance:
                min_distance = dist
                min_st = st

        return min_st
    except:
        return "error"


def find_station_manh(y, x, stations=METRO_STATIONS):
    """Вывод ближайшей станции метро, учитывая манхэттенское расстояние.
    Как и в географии, первая передаётся широта (y), вторая долгота (x).
    Предпочтительный тип определения ближайшей станции метро.

    Параметры:
            y: координата широты (float)
            x: координата долготы (float)
            stations: список станций метро

    Возвращаемое значение:
            Название ближайшей станции в формате строки
            """
    try:
        min_distance = abs(float(stations['Южная'][0]) - y) + abs(float(stations['Южная'][1]) - x)
        min_st = 'Южная'
        for st in stations:
            y1 = float(stations[st][0])
            x1 = float(stations[st][1])

            dist = abs(y1 - y) + abs(x1 - x)
            if dist <= min_distance:
                min_distance = dist
                min_st = st

        return min_st
    except:
        return "error"
