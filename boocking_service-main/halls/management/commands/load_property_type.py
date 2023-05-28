import csv
from django.core.management import BaseCommand

from halls.models import HallType, Property


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', help='csv file with types properties list(delimiter=";"')

    def handle(self, *args, **options):
        file = options['file']
        with open(file, 'r') as f:
            csv_reader = csv.reader(f, delimiter=';')
            next(csv_reader)
            for line in csv_reader:
                type_name = line[0]
                property_name = line[1]
                property_type = line[2]

                try:
                    hall_type = HallType.objects.get(type_name=type_name)
                except HallType.DoesNotExist:
                    self.stdout.write(f'hall type with name {type_name} does not exist')
                    continue
                type_property = Property.objects.create(
                    hall_type=hall_type,
                    property_name=property_name,
                    property_type=property_type
                )
                self.stdout.write(
                    f'property {type_property.property_name} with type {type_property.property_type} created')

