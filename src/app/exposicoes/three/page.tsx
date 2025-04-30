import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), {
  ssr: false,
});

const ThreePage = () => {
  return <ThreeScene />;
};

export default ThreePage;
