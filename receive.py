#!/usr/bin/env python
import pika
import json
from datetime import datetime
from pprint import pprint
import tropo
connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='pocket.monitor')

print ' [*] Waiting for messages. To exit press CTRL+C'

def callback(ch, method, properties, body):
    print " %s: [x] Received %r" % (datetime.now(),body,)
    data = json.loads(body)
    eventlevel = (data['eventlevel'])
    if eventlevel == 0 :
        print("Darkness Rules")
	tropo.sendMsg('359884101377', 'Georgi Alipiev', 'Someone opened the package')
 

channel.basic_consume(callback,
                      queue='pocket.monitor',
                      no_ack=True)

channel.start_consuming()
