import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const vpc = new aws.ec2.Vpc("pulumi-vpc", {
    cidrBlock: "10.0.0.0/16",
    instanceTenancy: "default",
    tags: {
        Name: "pulumi-vpc",
        Project: "starter-kit"
    },
});

const publicSubnet1 = new aws.ec2.Subnet("pulumi-public-subnet-1", {
    vpcId: vpc.id,
    availabilityZone: "eu-west-2a",
    cidrBlock: "10.0.1.0/24",
    tags: {
        Name: "pulumi-public-subnet",
        Project: "starter-kit"
    },
});

const publicSubnet2 = new aws.ec2.Subnet("pulumi-public-subnet-2", {
    vpcId: vpc.id,
    availabilityZone: "eu-west-2b",
    cidrBlock: "10.0.2.0/24",
    tags: {
        Name: "pulumi-public-subnet",
        Project: "starter-kit"
    },
});

const publicSubnet3 = new aws.ec2.Subnet("pulumi-public-subnet-3", {
    vpcId: vpc.id,
    availabilityZone: "eu-west-2c",
    cidrBlock: "10.0.3.0/24",
    tags: {
        Name: "pulumi-public-subnet",
        Project: "starter-kit"
    },
});