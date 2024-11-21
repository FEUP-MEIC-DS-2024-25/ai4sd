// Imports the Google Cloud client library
import { PubSub } from '@google-cloud/pubsub';

async function quickstart(
  projectId = 'jarvis-comms-test', // Your Google Cloud Platform project ID
  topicNameOrId = 'files-downloaded', // Name for the new topic to create
  subscriptionName = 'my-sub' // Name for the new subscription to create
) {
  // Instantiates a client
  const pubsub = new PubSub({ projectId });

  // Creates a new topic
  const [topic] = await pubsub.createTopic(topicNameOrId);
  console.log(`Topic ${topic.name} created.`);

  // Creates a subscription on that new topic
  const [subscription] = await topic.createSubscription(subscriptionName);

  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    console.log('Received message:', message.data.toString());
    process.exit(0);
  });

  // Receive callbacks for errors on the subscription
  subscription.on('error', error => {
    console.error('Received error:', error);
    process.exit(1);
  });

  // Send a message to the topic
  topic.publishMessage({ data: Buffer.from('Test message!') });
}