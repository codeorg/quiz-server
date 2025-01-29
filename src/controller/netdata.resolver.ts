import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import NetdataType from "./netdata.type";
import NetdataType2 from "./netdata2.type";
//import {searchByNetdataAPI} from '../../util'

@Resolver()
class NetdataResolver {
  private netdataCollection: NetdataType[]
  @Query(returns => [NetdataType])
  async netdata_json(
    @Arg("chart") chart: string,
    @Arg("option") option: string,
    @Arg("dimensions") dimensions: string,
    ) {
    const format = 'json'
    //const data = await searchByNetdataAPI({ chart, format, option, dimensions })
    //console.log('data',data)
    return {data:'bb'}
  }
  @Query(returns => [NetdataType2])
  async netdata_array(
    @Arg("chart") chart: string,
    @Arg("option") option: string,
    @Arg("dimensions") dimensions: string,
    ) {
    const format = 'array'
    //const data = await searchByNetdataAPI({ chart, format, option, dimensions })
    //console.log('data',data)
    return {data:'aa'}
  }
}

export default NetdataResolver;
