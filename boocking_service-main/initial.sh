# load hall types
python manage.py load_hall_type --file internal_files/hall_types.csv

# load type properties
python manage.py load_property_type --file internal_files/type_properties.csv

# load order status
python manage.py load_order_status --file internal_files/order_status.csv

# load event types
python manage.py load_event_type --file internal_files/event_type.csv

# load interests
python manage.py load_interests --file internal_files/user_interests.csv

# load units
python manage.py load_unit --file internal_files/unit_price.csv

#load moderating status
python manage.py load_moderating_status --file internal_files/moderating_status

# create staff user
#python manage.py create_staff_user