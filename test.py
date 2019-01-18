import boto3
from datetime import datetime
import time

client = boto3.client('sagemaker')

t=datetime.fromtimestamp(time.time())
job = t.strftime('%Y-%m-%d-%H-%M-%S')

response = client.create_training_job(
  TrainingJobName='object-detection-' + job,
  HyperParameters={
    'string': 'string'
  },
  AlgorithmSpecification={
    'TrainingImage': '811284229777.dkr.ecr.us-east-1.amazonaws.com/object-detection:latest',
    #'AlgorithmName': 'string',
    'TrainingInputMode': 'File',
    #'MetricDefinitions': [
    #  {
    #    'Name': 'string',
    #    'Regex': 'string'
    #  },
    #]
  },
  RoleArn='arn:aws:iam::472846177579:role/service-role/AmazonSageMaker-ExecutionRole-20180912T152967',
  InputDataConfig=[
    {
      'ChannelName': 'string',
      'DataSource': {
        'S3DataSource': {
          'S3DataType': 'S3Prefix',
          'S3Uri': 's3://sieling.household',
          'S3DataDistributionType': 'FullyReplicated',
          'AttributeNames': [
            'string',
          ]
        }
      },
      'ContentType': 'application/imageio',
      'CompressionType': 'None',
      'RecordWrapperType': 'None',
      'InputMode': 'File',
      'ShuffleConfig': {
        'Seed': 123
      }
    },
  ],
  OutputDataConfig={
    'KmsKeyId': 'string',
    'S3OutputPath': 's3://sieling.household/logs'
  },
  ResourceConfig={
    #'InstanceType': 'ml.m4.xlarge'|'ml.m4.2xlarge'|'ml.m4.4xlarge'|'ml.m4.10xlarge'|'ml.m4.16xlarge'|'ml.m5.large'|'ml.m5.xlarge'|'ml.m5.2xlarge'|'ml.m5.4xlarge'|'ml.m5.12xlarge'|'ml.m5.24xlarge'|'ml.c4.xlarge'|'ml.c4.2xlarge'|'ml.c4.4xlarge'|'ml.c4.8xlarge'|'ml.p2.xlarge'|'ml.p2.8xlarge'|'ml.p2.16xlarge'|'ml.p3.2xlarge'|'ml.p3.8xlarge'|'ml.p3.16xlarge'|'ml.c5.xlarge'|'ml.c5.2xlarge'|'ml.c5.4xlarge'|'ml.c5.9xlarge'|'ml.c5.18xlarge',
    'InstanceType': 'ml.p2.xlarge',
    'InstanceCount': 1,
    'VolumeSizeInGB': 5,
    'VolumeKmsKeyId': 'string'
  },
  #VpcConfig={
  #  'SecurityGroupIds': [
  #    'string',
  #  ],
  #  'Subnets': [
  #    'string',
  #  ]
  #},
  StoppingCondition={
    'MaxRuntimeInSeconds': 60 * 5
  },
  Tags=[
    {
      'Key': 'string',
      'Value': 'string'
    },
  ],
  EnableNetworkIsolation=False,
  EnableInterContainerTrafficEncryption=False
)

print(response)
