import Map from "@/components/map";


const vehicles = [
   {
     _id: "vehicle1",
     plateNumber: "ABC-1234",
     location: {
       lat: 9.0108,
       lng: 38.7613,
     },
     updatedAt: "2025-04-28T10:30:00Z",
   },
   {
     _id: "vehicle2",
     plateNumber: "XYZ-5678",
     location: {
       lat: 9.0205,
       lng: 38.7520,
     },
     updatedAt: "2025-04-28T10:31:00Z",
   },
   {
     _id: "vehicle3",
     plateNumber: "DEF-9012",
     location: {
       lat: 9.0000,
       lng: 38.7700,
     },
     updatedAt: "2025-04-28T10:32:00Z",
   },
   {
     _id: "vehicle4",
     plateNumber: "GHI-3456",
     location: {
       lat: 9.0150,
       lng: 38.7800,
     },
     updatedAt: "2025-04-28T10:33:00Z",
   }
 ];
export default async function HomePage() {
  // const vehicles = await fetchVehicles();

  

  return (
    <main>
      <Map vehicles={vehicles} />
    </main>
  );
}
