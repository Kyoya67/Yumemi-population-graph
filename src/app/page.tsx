
import { PrefectureList } from '../components/features/PrefectureList';

export default function Hom() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>都道府県別人口推移グラフ</h1>
      <PrefectureList />
    </main>
  )
}
