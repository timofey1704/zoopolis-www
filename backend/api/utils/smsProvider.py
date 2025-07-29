import requests
from django.conf import settings

#config
SMS_API_URL = 'https://cabinet.smsp.by/api/send/sms'
user = settings.SMS_USER
apikey = settings.SMS_API_KEY

def sendsms(phone, message):
    data = {'user': user, 'apikey': apikey, 'msisdn': phone, 'text': message}
    try:
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        request = requests.post(SMS_API_URL, data=data, headers=headers)
        return request.json()
    except Exception as e:
        return {
            'status': False,
            'error': {
                'code': 1,
                'description': str(e)
            }
        }

# sendsms(375333832840, 'Testmessage')