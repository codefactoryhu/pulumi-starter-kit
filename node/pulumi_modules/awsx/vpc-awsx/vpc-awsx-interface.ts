interface vpcType {
    name: string;
    cidr: string;
    numberOfAvailabilityZones: number;
    availabilityZoneNames: string[];
    instanceTenancy: string;
};

export { vpcType };