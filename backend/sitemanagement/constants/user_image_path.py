def user_image_upload_path(instance, filename):
    """Генерирует путь: media/{username}/{filename}"""
    return f"{instance.user.username}/{filename}"