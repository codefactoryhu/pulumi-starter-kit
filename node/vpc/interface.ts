interface vpcType {
    name: string;
    cidr: string;
    instanceTenancy: string;
}

interface subnetType {
    name: string;
    cidr: string[];
    mapPublicIpOnLaunch: boolean;
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