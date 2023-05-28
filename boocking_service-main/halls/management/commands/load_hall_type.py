import csv
from django.core.management.base import BaseCommand, CommandError

from halls.models import HallType


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', help='csv file with hall types list(delimiter=";"')

    def handle(self, *args, **options):
        file_in = options['file']
        with open(file_in, 'r') as f:
            csv_reader = csv.reader(f, delimiter=';')
            # skip header
            next(csv_reader)
            for line in csv_reader:
                type_name = line[0]
                hall_type = HallType.objects.create(type_name=type_name)
                self.stdout.write(f'{hall_type} created')

