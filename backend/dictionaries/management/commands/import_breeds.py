from django.core.management.base import BaseCommand
from dictionaries.models import PetsTypes, PetsBreeds

class Command(BaseCommand):
    help = 'Импорт пород котов и собак из txt файлов'

    def handle(self, *args, **options):
        files = {
            'Кот': '/Users/timofey/Downloads/cats.txt',
            'Собака': '/Users/timofey/Downloads/dogs.txt'
        }

        for pet_type_name, file_path in files.items():
            pet_type, created = PetsTypes.objects.get_or_create(name=pet_type_name)
            if created:
                self.stdout.write(f'Создан тип питомца: {pet_type_name}')
            else:
                self.stdout.write(f'Тип питомца уже существует: {pet_type_name}')

            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    breed_name = line.strip()
                    if breed_name:
                        created = PetsBreeds.objects.get_or_create(
                            pet_type=pet_type,
                            name=breed_name
                        )
                        if created:
                            self.stdout.write(f'Добавлена порода: {breed_name}')
                        else:
                            self.stdout.write(f'Порода уже существует: {breed_name}')

        self.stdout.write(self.style.SUCCESS('Импорт завершён'))