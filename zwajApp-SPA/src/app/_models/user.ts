import { Photo } from "./photo";

export interface User{
    id:number;
    username:string;
    Gender: string;
    Age :number;
    KnownAs :string;
    Created :Date;
    LastActive:Date;
    PhotoURL:string;
    City :string;
    Country:string;
    Interests?:string;
    Introduction?:string;
    LookingFor?:string;
    Photos?:Photo[];

}