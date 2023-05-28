from django.core.management import BaseCommand
from django.contrib.auth import get_user_model


User = get_user_model()


class Command(BaseCommand):

    def handle(self, *args, **options):

        staff = User.objects.create_user(
            username='staff',
            is_staff=True,
            email='staff@gmail.com',
            password='staff',
            inn='123456789')

        self.stdout.write('staff user created')