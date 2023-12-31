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
- KMS
    - KMS key
    - KMS key alias
- EKS
    - 4 self-managed addons
    - EKS-managed nodegroup

## AWSX
In the awsx folder there are modules created with Pulumi's AWSX library. It is working as well, but currently not used in this code. Instead we are using Pulumi AWS Classic library

## How to set up environment

### Install requirements
#### Pulumi
To run this code successfully you need to install pulumi on your local machine.  
Follow the instructions from Pulumi's website to do so:  
https://www.pulumi.com/docs/install/  

#### NPM, Node
  
To install the latest the latest npm and Node version:  
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
  
In the _package.json_ file you can define the entry point of Pulumi (index.ts by default), the desired Node version and the required dependency packages.  
You have to install **@pulumi/pulumi** and **@pulumi/aws** packages for this stack.  
  
For installation enter the directory of _package.json_ and run:  
**npm install**

  
```
{
    "name": "aws-starter-kit",
    "version": "1.0.0",
    "main": "index.ts",
    "devDependencies": {
        "@types/node": "^16"
    },
    "dependencies": {
        "@pulumi/pulumi": "^3.0.0",
        "@pulumi/aws": "^6.7.0"
    }
}

```

### Set up AWS CLI
As this code will create resources in AWS you need to configure your AWS profile credendials. Pulumi will use these credentials by default.
- Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- Configure AWS profile: https://docs.aws.amazon.com/cli/latest/reference/configure/

## Modifying resources
To modify AWS resources to fit your needs (e.g. change CIDR values, availability zones, number of subnets, etc...) open the _Pulumi.dev.yaml_ and _Pulumi.prod.yaml_ file and modify the values there. This files contain the variables used by the code in different environments.

## Running Pulumi
### Create stack
There are currently 2 different environments in this project, a _dev_ and a _prod_. Before running the code you have to create a stack for both environments.
```
pulumi stack init dev
```
```
pulumi stack init prod
```
Now you can change between these stack and Pulumi will automatically use the corresponding _yaml_ file to read the variables.
To change between stacks:
```
pulumi stack select dev
pulumi stack select prod
```

### Create resources
After your environment is configured:
- Clone this repository
- Enter the _node_ directory
- Run command: **pulumi up**
  
This command will first check if the pulumi configuration is valid and the resources can be created. If everything is fine you can select yes in your terminal and the resources will be created in a few minutes.

### Destroy resources
To destroy the stack that Pulumi created just run:  
**pulumi destroy**