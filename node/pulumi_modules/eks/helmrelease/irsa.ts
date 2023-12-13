import * as aws     from '@pulumi/aws';

import { createdCluster } from "../cluster/eks";
import { createdNodeGroup } from "../nodegroups/nodegroup";

export function iamRoleServiceAccount() {
    const assumeRole = aws.iam.getPolicyDocument({
        statements: [{
            effect: "Allow",
            principals: [{
                type: "Service",
                identifiers: ["ec2.amazonaws.com"],
            }],
            actions: ["sts:AssumeRole"],
        }],
    });

    const albIngressRole = new aws.iam.Role("aws-load-balancer-controller-role", {
        name: "aws-load-balancer-controller-role",
        assumeRolePolicy: assumeRole.then(assumeRole => assumeRole.json)
    });

    const albInlinePolicy = aws.iam.getPolicyDocument({
            statements: [
                {
                    actions: ["iam:CreateServiceLinkedRole"],
                    conditions: [
                    {
                        test: "StringEquals",
                        variable: "iam:AWSServiceName",
                        values: ["elasticloadbalancing.amazonaws.com"]
                    }],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: [
                        "elasticloadbalancing:DescribeTargetHealth",
                        "elasticloadbalancing:DescribeTargetGroups",
                        "elasticloadbalancing:DescribeTargetGroupAttributes",
                        "elasticloadbalancing:DescribeTags",
                        "elasticloadbalancing:DescribeSSLPolicies",
                        "elasticloadbalancing:DescribeRules",
                        "elasticloadbalancing:DescribeLoadBalancers",
                        "elasticloadbalancing:DescribeLoadBalancerAttributes",
                        "elasticloadbalancing:DescribeListeners",
                        "elasticloadbalancing:DescribeListenerCertificates",
                        "ec2:GetCoipPoolUsage",
                        "ec2:DescribeVpcs",
                        "ec2:DescribeVpcPeeringConnections",
                        "ec2:DescribeTags",
                        "ec2:DescribeSubnets",
                        "ec2:DescribeSecurityGroups",
                        "ec2:DescribeNetworkInterfaces",
                        "ec2:DescribeInternetGateways",
                        "ec2:DescribeInstances",
                        "ec2:DescribeCoipPools",
                        "ec2:DescribeAvailabilityZones",
                        "ec2:DescribeAddresses",
                        "ec2:DescribeAccountAttributes"
                    ],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: [
                        "wafv2:GetWebACLForResource",
                        "wafv2:GetWebACL",
                        "wafv2:DisassociateWebACL",
                        "wafv2:AssociateWebACL",
                        "waf-regional:GetWebACLForResource",
                        "waf-regional:GetWebACL",
                        "waf-regional:DisassociateWebACL",
                        "waf-regional:AssociateWebACL",
                        "shield:GetSubscriptionState",
                        "shield:DescribeProtection",
                        "shield:DeleteProtection",
                        "shield:CreateProtection",
                        "iam:ListServerCertificates",
                        "iam:GetServerCertificate",
                        "cognito-idp:DescribeUserPoolClient",
                        "acm:ListCertificates",
                        "acm:DescribeCertificate"
                    ],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: [
                        "ec2:RevokeSecurityGroupIngress",
                        "ec2:AuthorizeSecurityGroupIngress"
                    ],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: ["ec2:CreateSecurityGroup"],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: ["ec2:CreateTags"],
                    conditions: [
                    {
                        test: "Null",
                        variable: "aws:RequestTag/elbv2.k8s.aws/cluster",
                        values: ["false"]

                    },
                    {
                        test: "StringEquals",
                        variable: "ec2:CreateAction",
                        values: ["CreateSecurityGroup"]
                    }],
                    effect: "Allow",
                    resources: ["arn:aws:ec2:*:*:security-group/*"]
                },
                {
                    actions: [
                        "ec2:DeleteTags",
                        "ec2:CreateTags"
                    ],
                    conditions: [
                    {
                        test: "Null",
                        variable: "aws:RequestTag/elbv2.k8s.aws/cluster",
                        values: ["true"],
    
                    },
                    {
                        test: "Null",
                        variable: "aws:ResourceTag/elbv2.k8s.aws/cluster",
                        values: ["false"]
                    }],
                    effect: "Allow",
                    resources: ["arn:aws:ec2:*:*:security-group/*"]
                },
                {
                    actions: [
                        "ec2:RevokeSecurityGroupIngress",
                        "ec2:DeleteSecurityGroup",
                        "ec2:AuthorizeSecurityGroupIngress"
                    ],
                    conditions: [
                    {
                        test: "Null",
                        variable: "aws:ResourceTag/elbv2.k8s.aws/cluster",
                        values: ["false"]
                    }],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: [
                        "elasticloadbalancing:CreateTargetGroup",
                        "elasticloadbalancing:CreateLoadBalancer"
                    ],
                    conditions: [
                    {
                        test: "Null",
                        variable: "aws:RequestTag/elbv2.k8s.aws/cluster",
                        values: ["false"]
                    }],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: [
                        "elasticloadbalancing:DeleteRule",
                        "elasticloadbalancing:DeleteListener",
                        "elasticloadbalancing:CreateRule",
                        "elasticloadbalancing:CreateListener"
                    ],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: [
                        "elasticloadbalancing:RemoveTags",
                        "elasticloadbalancing:AddTags"
                    ],
                    conditions: [
                    {
                        test: "Null",
                        variable: "aws:RequestTag/elbv2.k8s.aws/cluster",
                        values: ["true"]
                    },
                    {
                        test: "Null",
                        variable: "aws:ResourceTag/elbv2.k8s.aws/cluster",
                        values: ["false"]
                    }],
                    effect: "Allow",
                    resources: [
                        "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                        "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                        "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
                    ]
                },
                {
                    actions: [
                        "elasticloadbalancing:RemoveTags",
                        "elasticloadbalancing:AddTags"
                    ],
                    effect: "Allow",
                    resources: [
                        "arn:aws:elasticloadbalancing:*:*:listener/net/*/*/*",
                        "arn:aws:elasticloadbalancing:*:*:listener/app/*/*/*",
                        "arn:aws:elasticloadbalancing:*:*:listener-rule/net/*/*/*",
                        "arn:aws:elasticloadbalancing:*:*:listener-rule/app/*/*/*"
                    ]
                },
                {
                    actions: ["elasticloadbalancing:AddTags"],
                    conditions: [
                    {
                        test: "Null",
                        variable: "aws:RequestTag/elbv2.k8s.aws/cluster",
                        values: ["false"]
                    },
                    {
                        test: "StringEquals",
                        variable: "elasticloadbalancing:CreateAction",
                        values: [
                            "CreateTargetGroup",
                            "CreateLoadBalancer"
                        ]
                    }],
                    effect: "Allow",
                    resources: [
                        "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                        "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                        "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
                    ]
                },
                {
                    actions: [
                        "elasticloadbalancing:SetSubnets",
                        "elasticloadbalancing:SetSecurityGroups",
                        "elasticloadbalancing:SetIpAddressType",
                        "elasticloadbalancing:ModifyTargetGroupAttributes",
                        "elasticloadbalancing:ModifyTargetGroup",
                        "elasticloadbalancing:ModifyLoadBalancerAttributes",
                        "elasticloadbalancing:DeleteTargetGroup",
                        "elasticloadbalancing:DeleteLoadBalancer"
                    ],
                    conditions: [
                    {
                        test: "Null",
                        variable: "aws:ResourceTag/elbv2.k8s.aws/cluster",
                        values: ["false"]
                    }],
                    effect: "Allow",
                    resources: ["*"]
                },
                {
                    actions: [
                        "elasticloadbalancing:RegisterTargets",
                        "elasticloadbalancing:DeregisterTargets"
                    ],
                    effect: "Allow",
                    resources: ["arn:aws:elasticloadbalancing:*:*:targetgroup/*/*"]
                },
                {
                    actions: [
                        "elasticloadbalancing:SetWebAcl",
                        "elasticloadbalancing:RemoveListenerCertificates",
                        "elasticloadbalancing:ModifyRule",
                        "elasticloadbalancing:ModifyListener",
                        "elasticloadbalancing:AddListenerCertificates"
                    ],
                    effect: "Allow",
                    resources: ["*"]
                }]
            });

    const albPolicy = new aws.iam.Policy("AWSLoadBalancerControllerIAMPolicy", {
        name: "AWSLoadBalancerControllerIAMPolicy",
        description: "Policy for Pulumi EKS ALB Ingress Controller",
        policy: albInlinePolicy.then(albInlinePolicy => albInlinePolicy.json),
    });

    const albRolePolicyAttach = new aws.iam.RolePolicyAttachment("pulumi-alb-role-policy-attach", {
        role: albIngressRole.name,
        policyArn: albPolicy.arn,
    });

    // const clusterNodeInstanceRoleName = createdCluster.instanceRoles.apply(roles => roles[0].name)

    // const nodeinstanceRole = new aws.iam.RolePolicyAttachment("eks-NodeInstanceRole-policy-attach", {
    //     policyArn: albPolicy.arn,
    //     role: clusterNodeInstanceRoleName
    // }, {dependsOn: createdNodeGroup});
};