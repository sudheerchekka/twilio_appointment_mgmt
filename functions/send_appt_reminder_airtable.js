const airtable = require("airtable");
const twilio = require("twilio");
var got = require('got');

exports.handler = function (context, event, callback) {

    const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_APPOINTMENTS);
    console.log("Airtable key:" + context.AIRTABLE_API_KEY);
    
    var twilioClient = context.getTwilioClient(); 
    let paramsMap = new Map();
   
   base("appointments")
    .select() //TODO: use filter to select the correct record instead of looping through the list
    .all()
    .then((records) => {
      const sendingMessages = records.map((record) => {
        const client = context.getTwilioClient();
          if (record.get('appointment_status') === "pending"){
              console.log("Name: " + record.get('Name'));
              console.log("appt Id: " + record.get('id'));
              console.log("airtable_record_id: " + record.getId());
              
              paramsMap['Name'] = record.get('Name');
              paramsMap['appointment_date'] = record.get('appointment_date');
              paramsMap['appointment_time'] = record.get('appointment_time');
              paramsMap['airtable_record_id'] = record.getId();
              paramsMap['appt_id'] = record.get('id');
        
          }
      });
      return Promise.all(sendingMessages);
    })
    .then(() => {
      
      console.log("paramsMap['Name']: " + paramsMap['Name'] );
      
      if (paramsMap['Name'] === undefined) //No appointments to be reminded
      {
         console.log("No appointments to be reminded");
         callback(null, "from studio function");
      }
      
      params_list = {
            "appointment_date": paramsMap['appointment_date'],
            "appointment_time": paramsMap['appointment_time'],
            "provider_name":"Owl Health",
            "patient_name": paramsMap['Name'],
            "airtable_record_id": paramsMap['airtable_record_id'],
            "appt_id": paramsMap['appt_id']
        };
    
      //use your Studio flow ID here, to and from (Twilio number) phone numbers
      twilioClient.studio.flows('FWXXXXXXXXXXXX').executions.create(
      { 
          to: '+1XXXXXXXXXX', 
          from: '+1XXXXXXXXXX',
          parameters: JSON.stringify(params_list)
      }
    )
    .then(function(execution) {
        console.log("Execution Id:" + execution.sid);
        callback(null, "from studio function");
    })
    .catch(err => callback(err));
    
    })
    .catch((err) => {
        console.log("airtable error");
        callback(err);
    });
};