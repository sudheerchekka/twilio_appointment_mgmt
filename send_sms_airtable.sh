#!/bin/bash

echo $1
if [[ $1 == "sms" ]]
then

        echo "sending SMS reminder..."
        curl https://black-bee-6064.twil.io/send_appt_reminder_airtable

else
        echo "sending voice reminder..."
        curl -X POST https://studio.twilio.com/v1/Flows/FWbb115b11ada121a655e4ef81d6394357/Executions -d "MachineDetection=Enable" -d "To=+14083985848" -d "From=+14084405435" --data-urlencode "Parameters={\"patient_name\":\"David O Dell\",\"provider_name\":\"Albert Chan\",\"appointment_date\":\"July 20\", \"appointment_time\":\"11AM\"}" -u $ACCOUNT_SID:$AUTH_TOKEN

fi