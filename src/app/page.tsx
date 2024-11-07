import { PopulationPage } from '@/components/pages/PopulationPage';

export default function Home() {
  return (
    <main className="container mt-5 mx-auto p-4">
      <h1 className="text-20 font-bold mb-4">都道府県別人口推移グラフ</h1>
      <PopulationPage />
    </main>
  );
}