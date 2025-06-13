
from django_cron import CronJobBase, Schedule
from django.utils.timezone import now
from .models import Reservation

class OverdueReservationCronJob(CronJobBase):
    RUN_EVERY_MINS = 15  # Change this as needed

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'core.overdue_reservation_cron_job'

    def do(self):
        current_time = now()
        overdue_reservations = Reservation.objects.filter(
            end_time__lt=current_time,
            last_park_out__isnull=True
        )

        for reservation in overdue_reservations:
            if reservation.status != "Overdue":
                reservation.status = "Overdue"
                reservation.save()
