import * as pulumi      from '@pulumi/pulumi';
import * as aws         from '@pulumi/aws';

// Import Interfaces
import { subnetType }   from '../vpc-interface';

// Import Outputs
import { createdVpc }   from '../vpc/vpc';

const config                = new pulumi.Config();
const project               = config.require("project");
const env                   = config.require("env")
const availabilityZone      = config.requireObject<string[]>("availabilityZone");
const pulumiPublicSubnet    = config.requireObject<subnetType>("publicSubnet");
const pulumiPrivateSubnet   = config.requireObject<subnetType>("privateSubnet");

// Used by Internet Gateway
export const publicSubnetIds:pulumi.Output<string>[] = [];

// Used by Internet Gateway, NAT Gateway
export const privateSubnetIds:pulumi.Output<string>[] = [];

export function publicSubnet() {
    for (let i = 0; i < availabilityZone.length; i++) {
        const publicSubnet = new aws.ec2.Subnet(`${pulumiPublicSubnet.name}-${i + 1}`, {
            vpcId:                  createdVpc.id,
            availabilityZone:       availabilityZone[i],
            cidrBlock:              pulumiPublicSubnet.cidr[i],
            mapPublicIpOnLaunch:    pulumiPublicSubnet.mapPublicIpOnLaunch,
            tags: {
                "Name": `${env}-${pulumiPublicSubnet.name}` , 
            },
        });
        publicSubnetIds.push(publicSubnet.id);
    }
}

export function privateSubnet() {
    for (let i = 0; i < availabilityZone.length; i++) {
        const publicSubnet = new aws.ec2.Subnet(`${pulumiPrivateSubnet.name}-${i + 1}`, {
            vpcId:                  createdVpc.id,
            availabilityZone:       availabilityZone[i],
            cidrBlock:              pulumiPrivateSubnet.cidr[i],
            mapPublicIpOnLaunch:    pulumiPublicSubnet.mapPublicIpOnLaunch,
            tags: {
                "Name"   : `${env}-${pulumiPrivateSubnet.name}`, 
           },
        });
        privateSubnetIds.push(publicSubnet.id);
    }
}