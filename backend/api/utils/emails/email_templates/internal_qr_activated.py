from api.utils.emails.email_sender import send_email
from api.models import UserProfile, RegisterQRCode
from django.utils import timezone

def qr_activated_email(qr: RegisterQRCode):
    """
    Функция для отправки емаила владельцу питомцев, если мы активировали QR код
    
    Args:
        qr: RegisterQRCode
    Returns:
        str: Результат отправки емаила
    """
    
    user = qr.user
    if not user:
        print("Warning: QR code has no associated user")
        return "Error: No user found"
        
    try:
        user_profile = UserProfile.objects.select_related('user').get(user=user)
    except UserProfile.DoesNotExist:
        print(f"Warning: No UserProfile found for user {user.pk}")
        return "Error: No user profile found"
        
    pet = qr.pet
    if not pet:
        print("Warning: QR code has no associated pet")
        return "Error: No pet found"
    
    try:
        # форматируем дату
        activation_date = qr.activation_date
        if activation_date:
            local_date = timezone.localtime(activation_date)
            formatted_date = local_date.strftime("%d.%m.%Y %H:%M")
        else:
            formatted_date = 'Не указана'
    except Exception as e:
        print(f"Warning: Error formatting activation date: {str(e)}")
        formatted_date = 'Ошибка форматирования'
    
    try:
        send_to = "info@zoopolis.com"
        email_subject = f"Активирован QR код"
        email_content = f"""
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff;">
            <h1 style="color: #1a1a1a; margin-bottom: 32px; font-size: 24px; font-weight: 600; text-align: center;">Активирован QR код</h1>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px; font-weight: 600;">Информация о QR коде</h2>
                <div style="margin: 20px 0;">
                     <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Код:</strong> {qr.code}, ID: {qr.pk}</p>
                    <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Дата активации:</strong> {formatted_date}</p>
                </div>
            </div>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px; font-weight: 600;">Данные о владельце:</h2>
                <div style="margin: 20px 0;">
                    <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Имя:</strong> {user.first_name or ''} {user.last_name or ''}</p>
                    <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Email:</strong> {user.email or 'Не указан'}</p>
                    <p style="color: #4a5568; margin: 12px 0; font-size: 16px; line-height: 1.5;"><strong style="color: #2d3748;">Номер телефона:</strong> {user_profile.phone_number or 'Не указан'}</p>
                </div>
            </div>

            <p style="font-size: 14px; color: #718096; margin-top: 32px; text-align: center; font-style: italic;">
                Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.
            </p>
        </div>
        """
        
        email_result = send_email(
            to=[send_to],
            subject=email_subject,
            html_content=email_content
        )
        
        if "Ошибка" in email_result:
            print(f"Warning: Failed to send email notification: {email_result}")
    except Exception as email_error:
        print(f"Warning: Error while sending email notification: {str(email_error)}")