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

interface elasticIpType {
    name: string;
}

interface internetGatewayType {
    name: string;
}

interface natGatewayType {
    name: string;
    connectivityType: string;
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
    elasticIpType,
    internetGatewayType,
    natGatewayType,
    routeTableType
};