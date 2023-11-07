import * as aws from "@pulumi/aws";
import {vpcVariables, publicSubnetVariables} from '../env'

export function createVpc(): aws.ec2.Vpc {
    const vpc = new aws.ec2.Vpc(vpcVariables.tags.Name, {
        cidrBlock: vpcVariables.cidrBlock,
        instanceTenancy: vpcVariables.instanceTenancy,
        tags: vpcVariables.tags,
    });
    return vpc
}

export function createPublicSubnets(vpc: aws.ec2.Vpc) {
    for (let i = 0; i < publicSubnetVariables.availabilityZone.length; i++) {
        const publicSubnet = new aws.ec2.Subnet(`${publicSubnetVariables.tags.Name}-${i + 1}`, {
            vpcId: vpc.id,
            availabilityZone: publicSubnetVariables.availabilityZone[i],
            cidrBlock: publicSubnetVariables.cidrBlock[i],
            tags: publicSubnetVariables.tags,
        })
    }
}

