import * as pulumi  from '@pulumi/pulumi';
import * as k8s from "@pulumi/kubernetes";

// Import Interfaces
import { eksClusterType } from '../eks-interface';

// import Outputs
import { createdCluster } from '../cluster/eks';

const config                = new pulumi.Config();
const pulumiEksCluster      = config.requireObject<eksClusterType>("eksCluster");

export function createAuthConfig() {
    // Create a Kubernetes provider instance using the kubeconfig from the EKS cluster
    const k8sProvider = new k8s.Provider("k8s-provider", {
        kubeconfig: createdCluster.kubeconfig.apply(JSON.stringify),
    });
    
    // Read the existing aws-auth ConfigMap
    const awsAuthConfigMap = k8s.core.v1.ConfigMap.get("aws-auth-configmap", "kube-system/aws-auth", { provider: k8sProvider });
    
    // Update the aws-auth ConfigMap with the additional IAM user mappings
    const updatedAwsAuthConfigMap = new k8s.core.v1.ConfigMap("aws-auth", {
        metadata: {
            name: "aws-auth",
            namespace: "kube-system",
        },
        // Merge the existing aws-auth ConfigMap data with new user mappings
        data: awsAuthConfigMap.data.apply(data => ({
            ...data,
            mapUsers: JSON.stringify(pulumiEksCluster.authUsers.map(userArn => ({
                userarn: userArn,
                username: userArn.split("/")[1],
                groups: ["system:masters"],
            }))),
        })),
    }, { provider: k8sProvider, dependsOn: [awsAuthConfigMap] });
}