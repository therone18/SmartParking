from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        from django_cron import CronJobManager
        from core.cron import OverdueReservationCronJob


        self.cron_manager = CronJobManager([
            OverdueReservationCronJob,
        ])
