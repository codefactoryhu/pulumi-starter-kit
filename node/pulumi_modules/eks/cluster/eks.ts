import * as eks from "@pulumi/eks";

// Import Outputs
import { createdVpc } from '../../awsx/vpc-awsx/vpc-awsx';

export function eksCluster() {
    const cluster = new eks.Cluster("pulumi-cluster", {
        vpcId: createdVpc.vpcId,
        publicSubnetIds: createdVpc.publicSubnetIds,
        privateSubnetIds: createdVpc.privateSubnetIds,
        nodeAssociatePublicIpAddress: false,
    })
}