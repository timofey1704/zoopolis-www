import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.utils import formataddr
from typing import Optional
from os.path import basename

from django.conf import settings


def send_email(
    to: list[str],
    subject: str,
    html_content: str,
    attachments: Optional[list[str]] = None,
    from_email: Optional[str] = None
) -> str:
    smtp_host = settings.MAIL_SERVER_URL
    smtp_port = int(settings.MAIL_SERVER_SMTP_PORT)
    smtp_user = settings.SENDER_MAIL_LOGIN
    smtp_pass = settings.SENDER_MAIL_PASSWORD
    from_email = from_email or settings.SENDER_EMAIL

    msg = MIMEMultipart()
    from_email = from_email or settings.CORP_EMAIL
    if not from_email:
        raise ValueError("from_email не задан и отсутствует в settings")
    
    msg['From'] = formataddr(('Zoopolis', from_email))
    msg['To'] = ', '.join(to)
    msg['Subject'] = subject

    msg.attach(MIMEText(html_content, 'html', 'utf-8'))

    # добавляем вложения
    if attachments:
        for file_path in attachments:
            try:
                with open(file_path, 'rb') as f:
                    part = MIMEApplication(f.read(), Name=basename(file_path))
                part['Content-Disposition'] = f'attachment; filename="{basename(file_path)}"'
                msg.attach(part)
            except Exception as e:
                print(f"Ошибка при прикреплении файла: {file_path} — {e}")

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(from_email, to, msg.as_string())

        return "Email отправлен успешно"

    except Exception as e:
        print(f"Ошибка при отправке письма: {e}")
        return f"Ошибка: {e}"