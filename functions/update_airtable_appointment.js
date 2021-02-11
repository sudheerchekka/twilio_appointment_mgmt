const airtable = require("airtable");
const twilio = require("twilio");

exports.handler = function (context, event, callback) {
    const response = new Twilio.Response();
    
    const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_APPOINTMENTS);
    console.log(context.AIRTABLE_API_KEY);
    
    appt_status = event.appt_status;
    console.log("appt_status: " + appt_status);
    console.log("reading appointments...");

    record_id = event.record_id;

         
         //update_appointment_status();
        base("appointments").update(
            record_id, 
            {"appointment_status": appt_status},
             (error, record) => {
              if (error) {
                console.error(error);
                throw error;
              } else {
                console.log("done");
                callback(null, "Success!!!!");

              }
            }
        );
    
};