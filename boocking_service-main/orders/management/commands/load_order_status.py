import csv
from django.core.management import BaseCommand, CommandError

from orders.models import OrderStatus


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--file', help='csv file with order statuses list(delimiter=";"', required=True)

    def handle(self, *args, **options):
        file = options['file']
        with open(file, 'r') as f:
            csv_reader = csv.reader(f, delimiter=';')
            next(csv_reader)
            for line in csv_reader:
                order_status_name = line[0]
                order_status = OrderStatus.objects.create(order_status_name=order_status_name)
                self.stdout.write(f'{order_status} created')
