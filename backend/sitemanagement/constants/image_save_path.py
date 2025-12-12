def devices_upload_path(instance, filename):
    """Генерирует путь: devices/{filename}"""
    return f"devices/{filename}"

def pet_image_upload_path(instance, filename):
    """Генерирует путь: media/{username}/pets/{filename}"""
    return f"{instance.owner.username}/pets/{filename}"

def pet_qr_upload_path(instance, filename):
    """Генерирует путь: media/{username}/qrcodes/{filename}"""
    return f"{instance.pet.owner.username}/qrcodes/{filename}"

def register_qr_upload_path(instance, filename):
    """Генерирует путь: media/register_qrcodes/{filename}"""
    return f"register_qrcodes/{filename}"

def user_image_upload_path(instance, filename):
    """Генерирует путь: media/{username}/{filename}"""
    return f"{instance.user.username}/{filename}"

def bonuses_upload_path(instance, filename):
    """Генерирует путь: bonuses/{filename}"""
    return f"bonuses/{filename}"

def services_upload_path(instance, filename):
    """Генерирует путь: services/{filename}"""
    return f"services/{filename}"

def main_media_upload_path(instance, filename):
    """Генерирует путь: media_main/{filename}"""
    return f"media_main/{filename}"