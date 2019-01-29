aws s3 sync ./aws_labels s3://sieling.household/train_annotation
aws s3 sync ./validation_labels s3://sieling.household/validation_annotation
aws s3 sync ./validation s3://sieling.household/validation/images
aws s3 sync ./images s3://sieling.household/train/images

