import { vpc }                          from './vpc/vpc';
import { publicSubnet, privateSubnet }  from './subnets/subnet';
import { internetGateway }              from './igw/igw';
import { elasticIp }                    from './eip/eip';
import { natGateway }                   from './nat_gw/natgw';
import { vpcFlowLogs }                  from './flowlog/flowlog';

export function createVpc() {
    vpc();
    publicSubnet();
    privateSubnet();
    internetGateway();
    elasticIp();
    natGateway();
    vpcFlowLogs();
}