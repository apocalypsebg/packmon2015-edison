#!/usr/bin/env python
import sys
import requests

def sendMsg(number, customername, message):
    token = '0eb582aadc34894e84d4afc9f1905f4c5e7f525a792f4fb95e37f4de9dbc4fc50580aecadaa1b01839d68a21'
    payload = {'token': token, 'numberToDial': number, 'customerName': customername, 'msg': message}
    r = requests.get("https://api.tropo.com/1.0/sessions?action=create", params=payload)
    print r.text
    return r.text
