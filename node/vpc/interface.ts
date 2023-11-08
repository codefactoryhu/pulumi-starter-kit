interface vpcType {
    name: string;
    cidr: string;
    instanceTenancy: string;
}

interface subnetType {
    name: string;
    cidr: string[];
}

interface internetGatewayType {
    name: string;
}

export
{
    vpcType,
    subnetType,
    internetGatewayType
};