import * as pulumi  from "@pulumi/pulumi";
import * as k8s     from "@pulumi/kubernetes";
import * as aws     from '@pulumi/aws';


// Import Interfaces
import { helmChartType } from '../eks-interface';

// import Outputs
import { createdCluster }   from '../cluster/eks';
import { createdNodeGroup } from '../nodegroups/nodegroup';

const config                = new pulumi.Config();
const pulumiCloudwatch      = config.requireObject<helmChartType>("cloudwatch");


export function CreateCloudwatchLogging() {
    // Export the cluster OIDC provider URL
    if (!createdCluster?.core?.oidcProvider) {
        throw new Error("Invalid cluster OIDC provider URL");
    }
    const clusterOidcProvider = createdCluster.core.oidcProvider;
    const clusterOidcProviderUrl = clusterOidcProvider.url;


    // Setup Pulumi Kubernetes provider
    const k8sProvider = new k8s.Provider("k8s-provider-cloudwatch", {
        kubeconfig: createdCluster.kubeconfig.apply(JSON.stringify),
    });


    // Create namespace
    const namespace = new k8s.core.v1.Namespace(pulumiCloudwatch.namespace, {
        metadata: {
            name: pulumiCloudwatch.namespace,
        },
    }, {
        provider: k8sProvider,
        dependsOn: createdNodeGroup,
    });

    
    // Create the new IAM policy for the Service Account
    const saName = "aws-for-fluent-bit";
    const saAssumeRolePolicy = pulumi.all([createdCluster.core.oidcProvider.url, createdCluster.core.oidcProvider.arn, namespace.metadata.name]).apply(([url, arn, namespace]) => aws.iam.getPolicyDocument({
        statements: [{
            actions: ["sts:AssumeRoleWithWebIdentity"],
            conditions: [{
                test: "StringEquals",
                values: [`system:serviceaccount:${namespace}:${saName}`],
                variable: `${url.replace("https://", "")}:sub`,
            }],
            effect: "Allow",
            principals: [{
                identifiers: [arn],
                type: "Federated",
            }],
        }],
    }));


    // Create role
    const saRole = new aws.iam.Role(saName, {
        assumeRolePolicy: saAssumeRolePolicy.json,
    });
    

    // Create policy
    const policy = new aws.iam.Policy("cloudwatch-irsa-policy", {
        name: "cloudwatch-irsa-policy",
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Action: [
                    "cloudwatch:PutMetricData",
                    "ec2:DescribeVolumes",
                    "ec2:DescribeTags",
                    "logs:PutLogEvents",
                    "logs:DescribeLogStreams",
                    "logs:DescribeLogGroups",
                    "logs:CreateLogStream",
                    "logs:CreateLogGroup",
                    "logs:PutRetentionPolicy"
                ],
                Effect: "Allow",
                Resource: "*",
            },{
                Action: [
                    "ssm:GetParameter",
                ],
                Effect: "Allow",
                Resource: "arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*",
            }],
        }),
    });


    // Attach the policy.
    const rolePolicyAttachment = new aws.iam.RolePolicyAttachment(saName, {
        policyArn: policy.arn,
        role: saRole,
    });
    

    // Create the Service Account with the IAM role annotated.
    const sa = new k8s.core.v1.ServiceAccount(saName, {
        metadata: {
            namespace: "cloudwatch",
            name: saName,
            annotations: {
                "eks.amazonaws.com/role-arn": saRole.arn,
            },
        },
    }, { provider: k8sProvider});


    // Helm release
    const release = new k8s.helm.v3.Release(pulumiCloudwatch.name, {
        name: pulumiCloudwatch.name,
        chart: pulumiCloudwatch.name,
        repositoryOpts: {
            repo:  pulumiCloudwatch.repository,
        },
        version:    pulumiCloudwatch.chartVersion,
        namespace:  pulumiCloudwatch.namespace,
        values:     pulumiCloudwatch.values,
      
        skipAwait: false,
    }, {
        provider:   createdCluster.provider,
        dependsOn:  [createdNodeGroup, sa],
        
    });

    

}



