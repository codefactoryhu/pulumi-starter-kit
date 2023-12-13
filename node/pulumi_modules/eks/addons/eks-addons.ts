import * as pulumi  from '@pulumi/pulumi';
import * as aws from "@pulumi/aws";

// Import Interfaces
import { eksClusterAddonType } from '../eks-interface';

// import Outputs
import { createdCluster } from '../cluster/eks';
import { createdNodeGroup } from '../nodegroups/nodegroup';

export let createdAddon:aws.eks.Addon;


const config                = new pulumi.Config();
const pulumicoreDns = config.requireObject<eksClusterAddonType>("coreDnsAddon");
const pulumikubeProxy = config.requireObject<eksClusterAddonType>("kubeProxyAddon");
const pulumivpcCni = config.requireObject<eksClusterAddonType>("vpcCniAddon");
const pulumiebsCsi = config.requireObject<eksClusterAddonType>("ebsCsiAddon");

export function coreDnsAddon() {
    const coreDnsAddon = new aws.eks.Addon(pulumicoreDns.name, {
        addonName: pulumicoreDns.name,
        resolveConflictsOnCreate: pulumicoreDns.resolveConflictsOnCreate,
        clusterName: createdCluster.eksCluster.name,
        addonVersion: pulumicoreDns.version,
    },{ dependsOn: [ createdNodeGroup ] });
}

export function kubeProxyAddon() {
    const kubeProxyAddon = new aws.eks.Addon(pulumikubeProxy.name, {
        addonName: pulumikubeProxy.name,
        resolveConflictsOnCreate: pulumikubeProxy.resolveConflictsOnCreate,
        clusterName: createdCluster.eksCluster.name,
        addonVersion: pulumikubeProxy.version,
    },{ dependsOn: [ createdNodeGroup ] });
}

export function vpcCniAddon() {
    const vpcCniAddon = new aws.eks.Addon(pulumivpcCni.name, {
        addonName: pulumivpcCni.name,
        resolveConflictsOnCreate: pulumivpcCni.resolveConflictsOnCreate,
        clusterName: createdCluster.eksCluster.name,
        addonVersion: pulumivpcCni.version,
    },{ dependsOn: [ createdNodeGroup ] });
}


export function ebsCsiAddon() {
    const ebsCsiDriverRole = new aws.iam.Role(`${pulumiebsCsi.name}-irsa`, {
        assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
            Service: "ec2.amazonaws.com",
        }),
    });

    const policyAttachment = new aws.iam.RolePolicyAttachment(`${pulumiebsCsi.name}-irsa-attachment`, {
        role: ebsCsiDriverRole,
        policyArn: "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy", 
    });

    const ebsCsiAddon = new aws.eks.Addon(pulumiebsCsi.name, {
        addonName: pulumiebsCsi.name,
        clusterName: createdCluster.eksCluster.name,
        addonVersion: pulumiebsCsi.version,
        serviceAccountRoleArn: ebsCsiDriverRole.arn,
    },{ dependsOn: [ createdNodeGroup ] });

    createdAddon = ebsCsiAddon;
}


