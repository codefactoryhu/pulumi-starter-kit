import * as aws from "@pulumi/aws";
import {
    vpcVariables,
    publicSubnetVariables,
    privateSubnetVariables,
    internetGatewayVariables
} from '../env'

export function createVpc(): aws.ec2.Vpc {
    const vpc = new aws.ec2.Vpc(vpcVariables.name, {
        cidrBlock: vpcVariables.cidrBlock,
        instanceTenancy: vpcVariables.instanceTenancy,
        tags: vpcVariables.tags,
    });
    return vpc
}

export function createPublicSubnets(vpc: aws.ec2.Vpc) {
    for (let i = 0; i < publicSubnetVariables.availabilityZone.length; i++) {
        const publicSubnet = new aws.ec2.Subnet(`${publicSubnetVariables.name}-${i + 1}`, {
            vpcId: vpc.id,
            availabilityZone: publicSubnetVariables.availabilityZone[i],
            cidrBlock: publicSubnetVariables.cidrBlock[i],
            tags: publicSubnetVariables.tags,
        });
    }
}

export function createPrivateSubnets(vpc: aws.ec2.Vpc) {
    for (let i = 0; i < privateSubnetVariables.availabilityZone.length; i++) {
        const publicSubnet = new aws.ec2.Subnet(`${privateSubnetVariables.name}-${i + 1}`, {
            vpcId: vpc.id,
            availabilityZone: privateSubnetVariables.availabilityZone[i],
            cidrBlock: privateSubnetVariables.cidrBlock[i],
            tags: privateSubnetVariables.tags,
        });
    }
}

export function createInternetGateway(vpc: aws.ec2.Vpc) {
    const igw = new aws.ec2.InternetGateway(`${internetGatewayVariables.name}`, {
        vpcId: vpc.id,
        tags: internetGatewayVariables.tags,
    });
}

