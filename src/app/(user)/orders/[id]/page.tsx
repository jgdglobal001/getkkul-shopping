// 정적 빌드를 위한 generateStaticParams 함수
export function generateStaticParams() {
  // 임시로 몇 개의 주문 ID 생성
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">주문 상세 정보</h1>
      <p>주문 ID: {id}</p>
      <p className="text-gray-600 mt-4">
        이 페이지는 정적 빌드용으로 임시 구현되었습니다.
        실제 주문 기능은 Cloudflare Functions로 구현 예정입니다.
      </p>
    </div>
  );
}