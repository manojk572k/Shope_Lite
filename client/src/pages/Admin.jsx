import { useEffect, useState } from "react";
import api from "../api";
import UseTitle from "../hooks/useTitle";

export default function Admin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/auth/admin").then(res => setData(res.data));
  }, []);
  UseTitle("Admin | ShopLite");



  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}


// Gave all naming starts with Uppercase