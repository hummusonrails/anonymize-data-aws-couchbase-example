const couchbase = require('couchbase');

exports.handler = async (event) => {
    console.log('Starting Lambda function'); 

    if (!event.Records || !Array.isArray(event.Records)) {
        throw new TypeError('event.Records is not iterable');
    }

    const connectionString = process.env.COUCHBASE_CONNECTION_STRING;
    const username = process.env.COUCHBASE_USERNAME;
    const password = process.env.COUCHBASE_PASSWORD;
    const bucketName = process.env.COUCHBASE_BUCKET_NAME;

    try {
        const cluster = await couchbase.connect(connectionString, {
            username: username,
            password: password
        });
        console.log('Connected to Couchbase cluster');

        const bucket = cluster.bucket(bucketName);
        const collection = bucket.defaultCollection();

        for (const record of event.Records) {
            console.log('Processing record:', record);
            const payload = JSON.parse(record.body);
            const transformedData = anonymizeData(payload);
            console.log('Transformed data:', transformedData);

            await collection.upsert(transformedData.purchase_id, transformedData);
            console.log('Data upserted:', transformedData.purchase_id);
        }
    } catch (error) {
        console.error('Error during processing:', error);
        throw error;
    }
};

function anonymizeData(data) {
    data.user.last_name = '';
    delete data.user.ip_address;
    return data;
}
