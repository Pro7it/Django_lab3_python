import { ResponsiveContainer, Treemap } from "recharts";

const sampleData = [
  { title: "Гамлет", rate: 4.9 },
  { title: "Король Лір", rate: 4.8 },
  { title: "Лісова пісня", rate: 4.8 },
  { title: "Тіні забутих предків", rate: 4.7 },
  { title: "Кайдашева сім’я", rate: 4.7 },
  { title: "Ромео і Джульєтта", rate: 4.6 },
  { title: "Наталка Полтавка", rate: 4.6 },
  { title: "Сто тисяч", rate: 4.5 },
  { title: "Мартин Боруля", rate: 4.5 },
  { title: "Свайпаючи ліворуч", rate: 4.4 },
  { title: "Три товариші", rate: 4.4 },
  { title: "Кайдаш", rate: 4.3 },
  { title: "Оркестр мрії", rate: 4.3 },
  { title: "Ляльковий будинок", rate: 4.2 },
  { title: "Іван Васильович міняє професію", rate: 4.2 },
  { title: "Ніч перед Різдвом", rate: 4.1 },
  { title: "Одруження", rate: 4.1 },
  { title: "Сватання на Гончарівці", rate: 4.0 },
  { title: "Пігмаліон", rate: 4.0 },
  { title: "Крик на мості", rate: 3.9 },
  { title: "Моя професія — синьйор з вищого світу", rate: 3.9 },
  { title: "Фрічний вечір", rate: 3.8 },
  { title: "Дракула", rate: 3.8 },
  { title: "Енеїда", rate: 3.7 },
  { title: "Втеча", rate: 3.7 },
  { title: "Фнаф", rate: 2.9 },
  { title: "Крик душі", rate: 2.8 },
  { title: "Прокляття баби Ганни", rate: 2.7 },
  { title: "Тун-Тун Захур", rate: 2.6 },
  { title: "Хаос у театрі", rate: 2.5 },
];

const data = sampleData.map((d) => ({
  ...d,
  size: d.rate * 100,
}));

function CustomContent(props: any) {
  const { x, y, width, height, title, rate } = props;

  if (width < 80 || height < 40) return null;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill="#82ca9d" />
      <text
        x={x + width / 2}
        y={y + height / 2 - 5}
        textAnchor="middle"
        fill="#000"
        strokeOpacity={0}
        fontSize={12}
      >
        {title}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 12}
        textAnchor="middle"
        fill="#000"
        strokeOpacity={0}
        fontSize={12}
      >
        ⭐ {rate}
      </text>
    </g>
  );
}

export default function MyTreeMapChart() {
  return (
    <ResponsiveContainer width="100%" height={700} aspect={4 / 3}>
      <Treemap
        width="100%"
        height="100%"
        data={data}
        dataKey="rate"
        stroke="#fff"
        fill="#82ca9d"
        content={<CustomContent />}
      />
    </ResponsiveContainer>
  );
}
