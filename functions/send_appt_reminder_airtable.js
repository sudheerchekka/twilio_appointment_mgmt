const airtable = require("airtable");
const twilio = require("twilio");
var got = require('got');





var send_sms_from_studio = function (twilioClient, paramsMap) {
    console.log("in function!!..: " + paramsMap['appointment_date']);
  
    params_list = {
            "appointment_date": paramsMap['appointment_date'],
            "appointment_time": paramsMap['appointment_time'],
            "provider_name":"Owl Health",
            "patient_name": paramsMap['Name'],
            "airtable_record_id": paramsMap['airtable_record_id']
    };
    

  //FW49b7c4f841de8dc219655278ad4895c0 (multiple_appts_same_phone)
  //FW0d52c395e177eec3b075f695469f496c (sms_appointment_reminder)
    return twilioClient.studio.flows('FW0d52c395e177eec3b075f695469f496c').executions.create(
      { 
          to: '+14083985848', 
          from: '+14086657542',
          parameters: JSON.stringify(params_list)
      }
    )
    .then(function(execution) {
        console.log("Execution Id:" + execution.sid);
        callback(null, "from studio function");
    })
    .catch(err => callback(err));
}


exports.handler = function (context, event, callback) {

    const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_APPOINTMENTS);
    console.log("Airtable key:" + context.AIRTABLE_API_KEY);
    
    var twilioClient = context.getTwilioClient(); 
    let paramsMap = new Map();
   
    /*paramsMap['Name'] = "TestNam";
    paramsMap['appointment_date'] = "1/1/1";
    paramsMap['appointment_time'] = "12:00AM";
    paramsMap['airtable_record_id'] = "12312321323";
    //send_sms_from_studio(twilioClient, paramsMap);
    
     params_list = {
            "appointment_date": paramsMap['appointment_date'],
            "appointment_time": paramsMap['appointment_time'],
            "provider_name":"Owl Health",
            "patient_name": paramsMap['Name'],
            "airtable_record_id": paramsMap['airtable_record_id']
    };*/
  
    
    
   base("appointments")
    .select() //TODO: use filter to select the correct record instead of looping through the list
    .all()
    .then((records) => {
      const sendingMessages = records.map((record) => {
        const client = context.getTwilioClient();
          if (record.get('appointment_status') === "pending"){
              console.log("Name: " + record.get('Name'));
              //console.log("Record Id: " + record.getId);
              console.log("appt Id: " + record.get('id'));
              
              console.log("airtable_record_id: " + record.getId());
              ///
              
              paramsMap['Name'] = record.get('Name');
              paramsMap['appointment_date'] = record.get('appointment_date');
              paramsMap['appointment_time'] = record.get('appointment_time');
              paramsMap['airtable_record_id'] = record.getId();
              paramsMap['appt_id'] = record.get('id');
        
             //await send_sms_from_studio(twilioClient, params_list)
        
              ///
              //return null;
          }
      });
      return Promise.all(sendingMessages);
    })
    .then(() => {
    
      //send_sms_from_studio(twilioClient, paramsMap);
      //callback(null, "Done!!");
      console.log("then of select");
      
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
    
        //sms_appointment_reminder: FW0d52c395e177eec3b075f695469f496c
        //multiple_appts_same_phone: https://studio.twilio.com/v2/Flows/FW49b7c4f841de8dc219655278ad4895c0/Executions
    
      twilioClient.studio.flows('FW0d52c395e177eec3b075f695469f496c').executions.create(
      { 
          to: '+14083985848', 
          from: '+14086657542',
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
    
    
    
    
    //callback(null, "Final Success!!!!");
  
};