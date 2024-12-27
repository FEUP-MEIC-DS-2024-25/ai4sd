from django.apps import AppConfig

class SparkConfig(AppConfig):
    name = 'spark'

    def ready(self):
        import spark.signals