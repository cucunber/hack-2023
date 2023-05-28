import csv

from django.core.management import BaseCommand

from halls.models import Unit


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', required=True, help='csv file with unit')

    def handle(self, *args, **options):
        file = options['file']
        with open(file, 'r') as f:
            csv_reader = csv.reader(f, delimiter=';')
            next(csv_reader)
            for rec in csv_reader:
                unit = Unit.objects.create(unit_name=rec[0])
                self.stdout.write(f'create unit: {unit}')
