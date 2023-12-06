import * as pulumi  from '@pulumi/pulumi';
import * as eks from '@pulumi/eks';

// Import Outputs (AWSX)
// import { createdVpc } from '../../awsx/vpc-awsx/vpc-awsx';

// Import Interfaces
import { eksClusterType } from '../eks-interface';

// Import Outputs (Classic)
import { createdVpc }       from '../../vpc/vpc/vpc';
import { publicSubnetIds }  from '../../vpc/subnets/subnet';
import { privateSubnetIds } from '../../vpc/subnets/subnet';
import { kmsArn }           from '../../kms/key/key';

const config                = new pulumi.Config();
const env                   = config.require("env");
const project               = config.require("project");
const pulumiEksCluster      = config.requireObject<eksClusterType>("eksCluster");

export let createdCluster:eks.Cluster;

export function eksCluster() {
    const cluster = new eks.Cluster(pulumiEksCluster.name, {
        name:                           `${env}-${pulumiEksCluster.name}`,
        vpcId:                          createdVpc.id,
        publicSubnetIds:                publicSubnetIds,
        privateSubnetIds:               privateSubnetIds,
        encryptionConfigKeyArn:         kmsArn,
        nodeAssociatePublicIpAddress:   pulumiEksCluster.nodeAssociatePublicIpAddress,
        instanceType: pulumiEksCluster.managedNodeGroupInstanceTypes[0],
        desiredCapacity: pulumiEksCluster.managedNodeGroupDesiredSize,
        minSize: pulumiEksCluster.managedNodeGroupMinSize,
        maxSize: pulumiEksCluster.managedNodeGroupMaxSize,
        tags: {
              "Name"   : `${env}-${pulumiEksCluster.name}`, 
              "Env"    : env, 
              "Project": project},
    })
    createdCluster = cluster;
}



