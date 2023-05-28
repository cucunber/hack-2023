import random

import django.db.utils
from django.core.management import BaseCommand

from users.models import User, Interest


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, help='count of user to create', required=True)

    def handle(self, *args, **options):
        user_count = options['count']
        interests = Interest.objects.all()
        while user_count:
            show_phone_number = bool(random.random() * random.randint(0, 1))
            username = f'test_user_{user_count * random.randint(15 ,90)}'
            try:
                user = User.objects.create(
                    username=username,
                    email=f'{username}@google.com',
                    first_name='test',
                    last_name='test',
                    show_phone_number=show_phone_number,
                    phone_number=int(random.random() * 1000000000000),
                    is_active=True
                )
            except django.db.utils.IntegrityError:
                continue
            user_interest = interests[random.randint(0, interests.count() - 2): interests.count() - 1]
            user.interest.add(*user_interest)
            user_count -= 1
