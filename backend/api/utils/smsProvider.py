import aiohttp
from django.conf import settings

SMS_API_URL = 'https://cabinet.smsp.by/api/send/sms'
user = settings.SMS_USER
apikey = settings.SMS_API_KEY

async def sendsms_async(phone, message):
    data = {'user': user, 'apikey': apikey, 'msisdn': phone, 'text': message}
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                SMS_API_URL, data=data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            ) as resp:
                return await resp.json()
    except Exception as e:
        return {
            'status': False,
            'error': {'code': 1, 'description': str(e)}
        }

# sendsms(375333832840, 'Testmessage')