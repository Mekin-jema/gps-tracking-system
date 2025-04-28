import Map from "@/components/map";
import { fetchVehicles } from "@/lib/api";


export default async function HomePage() {
  const vehicles = await fetchVehicles();

  return (
    <main>
      <Map vehicles={vehicles} />
    </main>
  );
}
