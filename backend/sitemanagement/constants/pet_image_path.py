def pet_image_upload_path(instance, filename):
    """Генерирует путь: media/{username}/pets/{filename}"""
    return f"{instance.owner.username}/pets/{filename}"