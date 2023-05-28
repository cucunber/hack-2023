import csv

from django.core.management import BaseCommand

from users.models import Interest


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', help='path to csv file with interests(";" separated)')

    def handle(self, *args, **options):
        file = options['file']
        with open(file, 'r') as f:
            csv_reader = csv.reader(f)
            # skip header
            next(csv_reader)
            for line in csv_reader:
                interest = Interest.objects.create(interest_name=line[0])
                self.stdout.write(f'{interest} created')
