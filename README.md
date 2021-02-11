# Artifacts for 2-way appointment reminders

The goal of this project is to provide reference implementation of 2-way appointment reminders


#### 2-way SMS with Confirm, Cancel and Reschedule options
* Set up Airtable
    * create a new base(AIRTABLE_BASE_APPOINTMENTS) and "appointments" table in it
    * confifigure the following in Twilio Functions
        * AIRTABLE_API_KEY
        * AIRTABLE_BASE_APPOINTMENTS
        * add "airtable" dependency (leave version empty)
    * create appointment records
        * TODO: script to populate data
* Demo steps
    * make sure there is only 1 active status record with SMS notification_preference
    * open the Gallery view to display the appointment records to be processed (good for demo visiblity)
    * ./send_sms_airtable sms (to call send_appt_reminder_airtable function)
        * this function picks up the first SMS active status record (reads the record_id)
        * calls sms_appointment_reminder Studio flow to send SMS to the phone_number
    * Reply Yes to see the appointment_status updating to "Confirmed"
    * Reply No to see the appointment_status updating to "Cancelled"
    * Reply RSCH to see hardcoded next available appointment spots 
        * update the dates mannualy in the Studio accordingly
    * Reply 1,2 or 3 to pick one of the appointments
    * Reply CALL to let the doctor office call the patient
