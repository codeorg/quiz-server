import { ObjectType, Field, Float } from "type-graphql";

@ObjectType({ description: "The NetdataType2 model" })
class NetdataType2 {
  @Field()
  api?:number;
  @Field()
  id?:string;
  @Field()
  name?:string;
  @Field()
  update_every?:number;
  @Field()
  view_update_every?:number;
  @Field()
  first_entry?:number;
  @Field()
  last_entry?:number;
  @Field()
  after?:number;
  @Field()
  before?:number;
  @Field(type => Float)
  min?:number;
  @Field(type => Float)
  max?:number;
  @Field(type => [String])
  dimension_names?:string[];
  @Field(type => [String])
  dimension_ids?:string[];
  @Field(type => Float)
  latest_values?:number[];
  @Field(type => Float)
  view_latest_values?:number[];
  @Field()
  dimensions?:number;
  @Field()
  points?:number;
  @Field()
  format?:string;
  @Field(type=>Float)
  result?:number[];
}
export default NetdataType2;
