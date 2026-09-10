import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { categories, loading, refresh };
}
