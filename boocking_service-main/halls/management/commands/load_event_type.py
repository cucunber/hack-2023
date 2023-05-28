import csv

from django.core.management import BaseCommand

from halls.models import EventType


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', help='csv file with event type name and ; separated', required=True)

    def handle(self, *args, **options):
        file = options['file']
        with open(file, 'r') as f:
            csv_reader = csv.reader(f, delimiter=';')
            # skip header
            next(csv_reader)
            for rec in csv_reader:
                event = EventType.objects.create(event_type_name=rec[0])
                self.stdout.write(f'{event} created')

