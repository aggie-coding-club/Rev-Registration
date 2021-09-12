const scheduler = require('@google-cloud/scheduler');

// This function lives in Google Cloud Functions in two forms: One that uses everyDay and
// another that uses every15, depending on what schedule we want to be set.
// E.g., if it's at the start of pre-registration we'll call the every15 version, then
// at the end of pre-registration we'll call the everyDay one.

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.updateScheduler24HrPubSub = async (event, context) => {
  const every15 = '*/15 * * * *'; // Every 15 min
  const everyDay = '0 12 * * *'; // once a day every day at noon
  
  // Create a client.
  const client = new scheduler.CloudSchedulerClient();

  // Construct the fully qualified location path.
  const job = client.jobPath("revregistration1", "us-central1", "scrape-courses-start-instances");

  // Construct the request body.
  const request = {
    job: {
      name: job,
      schedule: everyDay,
    },
    updateMask: {
      paths: ['schedule'],
    },
  };

  // Use the client to send the job update request.
  const [response] = await client.updateJob(request);
  console.log(`Updated job: ${response.name}`);
};
