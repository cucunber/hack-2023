import random
from django.core.management import BaseCommand, CommandError
from django.contrib.auth import get_user_model
import pandas as pd

from halls.models import Hall, Unit, HallModeratingStatus


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', required=True, help='path to file with halls from spec in xlsx format')

    def handle(self, *args, **options):
        file = options['file']
        spec_halls = pd.read_excel(file,
                                   converters={"hall_type": lambda x: tuple(x.strip("[]").replace("'", "").split(", ")),
                                               "event_type": lambda x: tuple(x.strip("[]").replace("'", "").split(", "))})
        User = get_user_model()
        try:
            user = User.objects.get(id=1)
        except User.DoesNotExist:
            raise CommandError('create staff user with ID=1')
        for row in spec_halls.iterrows():
            unit = Unit.objects.get(unit_name=row[1]['unit'].strip())
            moderated = HallModeratingStatus.objects.get(id=1)
            hall = Hall.objects.create(
                owner=user,
                name=str(row[1]['name']),
                descriptions=str(row[1]['descriptions']),
                address=str(row[1]['address']),
                # moderated=moderated,
                view_count=random.randint(0, 100),
                area=float(row[1]['area']),
                area_min=float(row[1]['area_min']),
                capacity=int(row[1]['capacity']),
                capacity_min=int(row[1]['capacity_min']),
                price=int(row[1]['price']),
                price_min=int(row[1]['price_min']),
                unit=unit,
                # rating=round(5 - random.random() / 10, 2),
                longitude=float(row[1]['longitude']),
                latitude=float(row[1]['latitude']),
                phone=str(row[1]['phone']),
                email=str(row[1]['email']),
                # hall_type=[int(value) for value in row[1]['hall_type']],
                # event_type=[int(value) for value in row[1]['event_type']],
                condition=str(row[1]['work_hours '])
            )
            print(hall)
            hall.moderated = moderated
            hall.save()
            hall.hall_type.add(*[int(value) for value in row[1]['hall_type']])
            hall.event_type.add(*[int(value) for value in row[1]['event_type']])
