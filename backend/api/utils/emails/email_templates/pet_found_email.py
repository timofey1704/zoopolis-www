from api.utils.emails.email_sender import send_email
from sitemanagement.models import Pet

def pet_found_email(pet: Pet):
    """
    Функция для отправки емаила владельцу питомцев, если мы получили координаты
    
    Args:
        pet: Pet
    Returns:
        str: Результат отправки емаила
    """
    try:
        pet_owner_email = pet.owner.email
        email_subject = f"Мы получили информацию о Вашем питомце!"
        email_content = f"""
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff;">
            <h1 style="color: #1a1a1a; margin-bottom: 32px; font-size: 24px; font-weight: 600; text-align: center;">Мы получили информацию о вашем питомце!</h1>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px; font-weight: 600;">Питомец {pet.name}</h2>
                <div style="margin: 20px 0;">
                    <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Тип:</strong> {pet.type}</p>
                    <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Порода:</strong> {pet.breed}</p>
                    <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Цвет:</strong> {pet.color}</p>
                </div>
            </div>

            <p style="font-size: 14px; color: #718096; margin-top: 32px; text-align: center; font-style: italic;">
                Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.
            </p>
        </div>
        """
        
        email_result = send_email(
            to=[pet_owner_email],
            subject=email_subject,
            html_content=email_content
        )
        
        if "Ошибка" in email_result:
            print(f"Warning: Failed to send email notification: {email_result}")
    except Exception as email_error:
        print(f"Warning: Error while sending email notification: {str(email_error)}")