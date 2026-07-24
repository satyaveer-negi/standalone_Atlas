// src/api/auth.ts

import API from "../../../api/axios";

export const getCurrentUser = async () => {
  const res = await API.get("auth/me/");
  return res.data;
};
