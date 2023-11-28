import * as eks from "@pulumi/eks";
import { vpc } from '../vpc-awsx/vpc-awsx';

export const cluster = new eks.Cluster("pulumi-cluster", {
    vpcId: vpc.vpcId,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    nodeAssociatePublicIpAddress: false,
})