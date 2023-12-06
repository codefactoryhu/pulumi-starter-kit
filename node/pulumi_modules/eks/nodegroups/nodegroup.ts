import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";

// Import Interfaces
import { eksClusterType } from '../eks-interface';

// import Outputs
import { createdCluster } from '../cluster/eks';

const config                = new pulumi.Config();
const pulumiEksCluster      = config.requireObject<eksClusterType>("eksCluster");


export function createNodeGroup() {

    const managedNodeGroup1 = new eks.ManagedNodeGroup(`${pulumiEksCluster.name}-managed-nodegroup`, {
        cluster: createdCluster.core,
        nodeGroupName: `${pulumiEksCluster.name}-ng`,
        nodeRoleArn: createdCluster.instanceRoles[0].arn,
        
        scalingConfig: {
            minSize: pulumiEksCluster.managedNodeGroupMinSize,
            maxSize: pulumiEksCluster.managedNodeGroupMaxSize,
            desiredSize: pulumiEksCluster.managedNodeGroupDesiredSize,
        },
        instanceTypes: pulumiEksCluster.managedNodeGroupInstanceTypes,
        diskSize: pulumiEksCluster.managedNodeGroupDiskSize,
    },{ dependsOn: [ createdCluster ] });
    
}