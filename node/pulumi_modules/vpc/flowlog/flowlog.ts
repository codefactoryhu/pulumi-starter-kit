import * as pulumi  from '@pulumi/pulumi';
import * as aws     from '@pulumi/aws';

// Import interfaces
import { vpcType }  from '../vpc-interface';

// Import Outputs
import { createdVpc }   from '../vpc/vpc';

const config    = new pulumi.Config();
const project   = config.require("project");
const env       = config.require("env")
const pulumiVpc = config.requireObject<vpcType>("vpc");


export function vpcFlowLogs() {
    if (pulumiVpc.enableFlowLogs) {
        
        const vpcLogGroup = new aws.cloudwatch.LogGroup(`${pulumiVpc.name}-log-group`, {
            name: `${env}-${pulumiVpc.name}-log-group`,
            tags: {
                "Env"    : env,
                "Project": project,
            }
        });

        const assumeRole = aws.iam.getPolicyDocument({
            statements: [{
                effect: "Allow",
                principals: [{
                    type: "Service",
                    identifiers: ["vpc-flow-logs.amazonaws.com"],
                }],
                actions: ["sts:AssumeRole"],
            }],
        });

        const vpcLogRole = new aws.iam.Role(`${pulumiVpc.name}-role`, {
            name: `${env}-${pulumiVpc.name}-role`,
            tags: {
                "Env"    : env,
                "Project": project,
            },
            assumeRolePolicy: assumeRole.then(assumeRole => assumeRole.json)});
        
        const vpcFlowLog = new aws.ec2.FlowLog(`${env}-${pulumiVpc.name}-flowlog`, {
            iamRoleArn: vpcLogRole.arn,
            logDestination: vpcLogGroup.arn,
            trafficType: "ALL",
            vpcId: createdVpc.id,
        });

        const vpcLogPolicyDocument = aws.iam.getPolicyDocument({
            statements: [{
                effect: "Allow",
                actions: [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                    "logs:DescribeLogGroups",
                    "logs:DescribeLogStreams",
                ],
                resources: ["*"],
            }],
        });
        const vpcLogRolePolicy = new aws.iam.RolePolicy(`${pulumiVpc.name}-role-policy`, {
            name: `${env}-${pulumiVpc.name}-role-policy`,
            role: vpcLogRole.id,
            policy: vpcLogPolicyDocument.then(vpcLogPolicyDocument => vpcLogPolicyDocument.json),
        });

    }

}