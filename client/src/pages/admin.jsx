import { useEffect, useState } from "react";
import api from "../api";
import useTitle from "../hooks/useTitle";

export default function Admin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/auth/admin").then(res => setData(res.data));
  }, []);
  useTitle("Admin | ShopLite");



  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
