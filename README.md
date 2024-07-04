# Anonymize Data with AWS and Couchbase Example

This example demonstrates how to use a Node.js AWS Lambda function to anonymize live data streams sent via message queue before sending to Couchbase Capella. The Lambda function is triggered by an AWS SQS message, which then invokes the function to anonymize the data by removing the user's last name and IP address before sending it to Couchbase for storage.

## Prerequisites

- Couchbase Capella account: You will need a Couchbase Capella account to store the data. You can sign up for a free account [here](https://cloud.couchbase.com). Capella is a fully managed Database-as-a-Service (DBaaS) that provides a cloud-native database platform.
- AWS account: You will need an AWS account to create an SQS queue and Lambda function. You can sign up for a free account [here](https://aws.amazon.com/).
- Node.js: You will need Node.js installed on your local machine to run the Lambda function locally. You can download Node.js [here](https://nodejs.org/).
- Docker: This function is packaged as a Docker container. You will need Docker installed on your local machine to build and run the container. You can download Docker [here](https://www.docker.com/).

## Setup

1. Clone this repository to your local machine:

```bash
git clone https://github.com/hummusonrails/anonymize-data-aws-couchbase-example.git
```

2. Change into the project directory:

```bash
cd anonymize-data-aws-couchbase-example
```

3. Install the dependencies:

```bash
npm install
```

Once you have installed the dependencies, you're ready to build the Docker container, deploy it to AWS ECR (Elastic Container Registry), and create the Lambda function.

## Build and Deploy the Docker Container

1. Build the Docker container:

```bash
docker build  --platform linux/amd64 -t anonymize-data-aws-couchbase-example .
```

Please note: In the example above, we are building the Docker container for the `linux/amd64` platform. If you are using a different platform, you will need to specify the appropriate platform in the `--platform` flag. *Make sure that the Docker platform matches the platform of the AWS Lambda function.*

2. Tag the Docker container:

```bash
docker tag anonymize-data-aws-couchbase-example:latest <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/anonymize-data-aws-couchbase-example:latest
```

Replace `<AWS_ACCOUNT_ID>` with your AWS account ID and `<AWS_REGION>` with the AWS region where you want to deploy the container.

3. Log in to the AWS CLI:

```bash
aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com
```

Replace `<AWS_REGION>` with the AWS region where you want to deploy the container and `<AWS_ACCOUNT_ID>` with your AWS account ID.

4. Push the Docker container to AWS ECR:

```bash
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/anonymize-data-aws-couchbase-example:latest
```

Replace `<AWS_ACCOUNT_ID>` with your AWS account ID and `<AWS_REGION>` with the AWS region where you want to deploy the container.

## Create the Lambda Function

1. Create an AWS Lambda function:

```bash
aws lambda create-function --function-name anonymize-data-aws-couchbase-example --package-type Image --code ImageUri=<AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/anonymize-data-aws-couchbase-example:latest --role <IAM_ROLE_ARN> --environment Variables={COUCHBASE_USERNAME=<COUCHBASE_USERNAME>,COUCHBASE_PASSWORD=<COUCHBASE_PASSWORD>,COUCHBASE_HOST=<COUCHBASE_HOST>,COUCHBASE_BUCKET=<COUCHBASE_BUCKET>}
```

Replace `<AWS_ACCOUNT_ID>` with your AWS account ID, `<AWS_REGION>` with the AWS region where you want to deploy the container, `<IAM_ROLE_ARN>` with the ARN of the IAM role that you want to assign to the Lambda function, `<COUCHBASE_USERNAME>` with your Couchbase Capella username, `<COUCHBASE_PASSWORD>` with your Couchbase Capella password, `<COUCHBASE_HOST>` with your Couchbase Capella host, and `<COUCHBASE_BUCKET>` with the name of the Couchbase bucket where you want to store the data.

2. Create an SQS queue:

```bash
aws sqs create-queue --queue-name anonymize-data-aws-couchbase-example
```

3. Configure the Lambda function to trigger on SQS messages:

```bash
aws lambda create-event-source-mapping --function-name anonymize-data-aws-couchbase-example --batch-size 1 --event-source-arn arn:aws:sqs:<AWS_REGION>:<AWS_ACCOUNT_ID>:anonymize-data-aws-couchbase-example
```

Replace `<AWS_REGION>` with the AWS region where you want to deploy the container and `<AWS_ACCOUNT_ID>` with your AWS account ID.

## Test the Lambda Function

1. Send a test message to the SQS queue:

```bash
aws sqs send-message --queue-url https://sqs.<AWS_REGION>.amazonaws.com/<AWS_ACCOUNT_ID>/AnonymizeDataAwsCouchbaseQueue --message-body file://message.json
```

Replace `<AWS_REGION>` with the AWS region where you deployed the SQS queue and `<AWS_ACCOUNT_ID>` with your AWS account ID. Note you are using the provided `message.json` file to send the test message. There is also a `sample_purchases.json` file that contains sample data that you can use to test the function.

2. Check the Couchbase bucket to verify that the data has been anonymized by logging into the Couchbase Capella console and viewing the data in the bucket. You can also use the Couchbase IDE plugin for either [VSCode](https://marketplace.visualstudio.com/items?itemName=Couchbase.vscode-couchbase) or [Jetbrains](https://plugins.jetbrains.com/plugin/22131-couchbase) to view the data inside your IDE.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



