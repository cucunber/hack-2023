import csv
from django.core.management import BaseCommand

from halls.models import HallModeratingStatus


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', required=True)

    def handle(self, *args, **options):
        file = options['file']
        with open(file, 'r') as f:
            csv_reader = csv.reader(f, delimiter=';')
            next(csv_reader)
            for line in csv_reader:
                status = HallModeratingStatus.objects.create(moderating_status_name=line[0])
                self.stdout.write(f'{status} created')
