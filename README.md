# Pulumi starter kit

## Overview
This repository contains a Pulumi kit to create AWS resources written in TypeScript.  
Currently this code will create the following resources:
- VPC
- 3 public subnets
- 3 private subnets
- Internet Gateway
- NAT Gateway
- Route tables  

## How to set up environment

### Install requirements
To run this code successfully you need to install pulumi on your local machine.  
Follow the instructions from Pulumi's website to do so:  
https://www.pulumi.com/docs/install/  
  
To install the latest NodeJs use this link:  
https://nodejs.org/en/download/package-manager

### Set up AWS CLI
As this code will create resources in AWS you need to configure your AWS profile credendials. Pulumi will use these credentials by default.
- Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Configure AWS profile: https://docs.aws.amazon.com/cli/latest/reference/configure/

## Running Pulumi
### Create resources
After your environment is configured:
- Clone this repository
- Enter the _node_ directory
- Run command: **pulumi up**  
  
This command will first check if the pulumi configuration is valid and the resources can be created. If everything is fine you can select yes in your terminal and the resources will be created in a few minutes.

### Destroy resources
To destroy the stack that Pulumi created just run:  
**pulumi destroy**