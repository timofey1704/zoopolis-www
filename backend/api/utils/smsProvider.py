import requests
from django.conf import settings

#config
SMS_API_URL = 'https://cabinet.smsp.by/api/'
user = settings.SMS_USER
apikey = settings.SMS_API_KEY

def sendsms(phone, message):
	data = {'user': user, 'apikey' : apikey, 'msisdn': phone, 'text': message}
	try:
		request = requests.get(SMS_API_URL, data = data)
		result = request.json()
		status = result['status']
	except Exception as e:
		print('Cannot send SMS: bad or no response from SmsP.')
		print(e)
	else:
		if (status == True):
			print('SMS accepted, status: {}'.format(status))
		else:
			print('SMS rejected, status: {}'.format(status))

# sendsms(375333832840, 'Testmessage')