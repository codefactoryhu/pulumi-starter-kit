// Global
const project = "starter-kit";

// VPC
export const vpcVariables = {
    name: "pulumi-vpc",
    cidrBlock: "10.0.0.0/16",
    instanceTenancy: "default",
    tags: {Name: "pulumi-vpc", Project: project}
};

// Subnets
export const publicSubnetVariables = {
    name: "pulumi-public-subnet",
    availabilityZone: ["eu-west-2a", "eu-west-2b", "eu-west-2c"],
    cidrBlock: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
    tags: {Name: "pulumi-public-subnet", Project: project}
}

export const privateSubnetVariables = {
    name: "pulumi-private-subnet",
    availabilityZone: ["eu-west-2a", "eu-west-2b", "eu-west-2c"],
    cidrBlock: ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"],
    tags: {Name: "pulumi-private-subnet", Project: project}
}

export const internetGatewayVariables = {
    name: "pulumi-internet-gateway",
    tags: {Name: "pulumi-internet-gateway", Project: project}
}