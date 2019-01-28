import boto3
from datetime import datetime
import time

client = boto3.client('sagemaker')

t=datetime.fromtimestamp(time.time())
job = t.strftime('%Y-%m-%d-%H-%M-%S')

response = client.create_training_job(
  TrainingJobName='object-detection-' + job,
  HyperParameters={
    'base_network': 'vgg-16',
    'early_stopping': 'false',
    'early_stopping_min_epochs': '10',
    'early_stopping_patience': '5',
    'early_stopping_tolerance': '0.0',
    'epochs': '200',
    'freeze_layer_pattern': 'false',
    'image_shape': '300',
    'label_width': '350',
    'learning_rate': '0.001',
    'lr_scheduler_factor': '0.1',
    'mini_batch_size': '32',
    'momentum': '0.9',
    'nms_threshold': '0.45',
    'num_classes': '12',
    'num_training_samples': '300',
    'optimizer': 'sgd',
    'overlap_threshold': '0.5',
    'use_pretrained_model': '1',
    'weight_decay': '0.0005'
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
      'ChannelName': 'train_annotation',
      'DataSource': {
        'S3DataSource': {
          'S3DataType': 'S3Prefix',
          'S3Uri': 's3://sieling.household/train',
          'S3DataDistributionType': 'FullyReplicated',
          'AttributeNames': [
  #          'string',
          ]
        }
      },
      'ContentType': 'application/x-image',
      'CompressionType': 'None',
      'RecordWrapperType': 'None',
      'InputMode': 'File',
      'ShuffleConfig': {
        'Seed': 123
      }
    },
        {
      'ChannelName': 'train',
      'DataSource': {
        'S3DataSource': {
          'S3DataType': 'S3Prefix',
          'S3Uri': 's3://sieling.household/train',
          'S3DataDistributionType': 'FullyReplicated',
          'AttributeNames': [
  #          'string',
          ]
        }
      },
      'ContentType': 'application/x-image',
      'CompressionType': 'None',
      'RecordWrapperType': 'None',
      'InputMode': 'File',
      'ShuffleConfig': {
        'Seed': 123
      }
    }, 
    {
      'ChannelName': 'validation',
      'DataSource': {
        'S3DataSource': {
          'S3DataType': 'S3Prefix',
          'S3Uri': 's3://sieling.household/validation',
          'S3DataDistributionType': 'FullyReplicated',
          'AttributeNames': [
  #          'string',
          ]
        }
      },
      'ContentType': 'application/x-image',
      'CompressionType': 'None',
      'RecordWrapperType': 'None',
      'InputMode': 'File',
      'ShuffleConfig': {
        'Seed': 123
      }
    },
    {
      'ChannelName': 'validation_annotation',
      'DataSource': {
        'S3DataSource': {
          'S3DataType': 'S3Prefix',
          'S3Uri': 's3://sieling.household/validation_annotation',
          'S3DataDistributionType': 'FullyReplicated',
          'AttributeNames': [
  #          'string',
          ]
        }
      },
      'ContentType': 'application/x-image',
      'CompressionType': 'None',
      'RecordWrapperType': 'None',
      'InputMode': 'File',
      'ShuffleConfig': {
        'Seed': 123
      }
    },
  ],
  OutputDataConfig={
 #   'KmsKeyId': 'string',
    'S3OutputPath': 's3://sieling.household/logs'
  },
  ResourceConfig={
    #'InstanceType': 'ml.m4.xlarge'|'ml.m4.2xlarge'|'ml.m4.4xlarge'|'ml.m4.10xlarge'|'ml.m4.16xlarge'|'ml.m5.large'|'ml.m5.xlarge'|'ml.m5.2xlarge'|'ml.m5.4xlarge'|'ml.m5.12xlarge'|'ml.m5.24xlarge'|'ml.c4.xlarge'|'ml.c4.2xlarge'|'ml.c4.4xlarge'|'ml.c4.8xlarge'|'ml.p2.xlarge'|'ml.p2.8xlarge'|'ml.p2.16xlarge'|'ml.p3.2xlarge'|'ml.p3.8xlarge'|'ml.p3.16xlarge'|'ml.c5.xlarge'|'ml.c5.2xlarge'|'ml.c5.4xlarge'|'ml.c5.9xlarge'|'ml.c5.18xlarge',
    'InstanceType': 'ml.p2.8xlarge',
    'InstanceCount': 1,
    'VolumeSizeInGB': 5
    #'VolumeKmsKeyId': 'string'
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
    'MaxRuntimeInSeconds': 60 * 60
  },
  Tags=[
    {
      'Key': 'objectdetection',
      'Value': 'termites'
    },
  ],
  EnableNetworkIsolation=False,
  EnableInterContainerTrafficEncryption=False
)

print(response)
