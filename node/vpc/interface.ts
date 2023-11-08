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

interface routeTableType {
    name: string;
    cidr: string;
    associationName: string;
}

export
{
    vpcType,
    subnetType,
    internetGatewayType,
    routeTableType
};