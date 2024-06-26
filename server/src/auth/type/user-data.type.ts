import {ConfigId} from "../../common/types";


export type UserData = {
  id?: ConfigId;
  email: string;
  hash: string;
};
