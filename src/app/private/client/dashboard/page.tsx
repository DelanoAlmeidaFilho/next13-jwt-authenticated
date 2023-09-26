import { setupAPIServer } from "@/services/http/setupAPIServer";

interface category {
  id: string;
  name: string;
}

export default async function Dashboard() {
  const api = await setupAPIServer();
  const { data } = await api.get<category[]>("/categories");

  return (
    <ul>
      {data.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}
