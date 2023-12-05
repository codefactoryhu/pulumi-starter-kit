interface eksClusterType {
    name: string;
    nodeAssociatePublicIpAddress: boolean;
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