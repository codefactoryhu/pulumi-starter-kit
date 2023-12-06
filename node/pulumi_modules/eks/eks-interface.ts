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

export {
    eksClusterType,
    eksClusterAddonType,
}