interface eksClusterType {
    name: string;
    nodeAssociatePublicIpAddress: boolean;
    managedNodeGroupInstanceTypes: Array<string>;
    managedNodeGroupMinSize: number;
    managedNodeGroupMaxSize: number;
    managedNodeGroupDesiredSize: number;
    managedNodeGroupDiskSize: number;
    authUsers: Array<string>;
}

interface eksClusterAddonType {
    name: string;
    version: string;
    resolveConflictsOnCreate?: string;
}

interface helmChartType {
    name: string;
    namespace: string;
    repository: string;
    chart: string;
    chartVersion: string;
    values: any;
}

export {
    eksClusterType,
    eksClusterAddonType,
    helmChartType,
}