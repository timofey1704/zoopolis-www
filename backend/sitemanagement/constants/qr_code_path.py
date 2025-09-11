def pet_qr_upload_path(instance, filename):
    """Генерирует путь: media/{username}/qrcodes/{filename}"""
    return f"{instance.pet.owner.username}/qrcodes/{filename}"

def register_qr_upload_path(instance, filename):
    """Генерирует путь: media/{username}/qrcodes/{filename}"""
    return f"/register_qrcodes/{filename}"