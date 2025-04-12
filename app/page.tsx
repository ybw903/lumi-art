import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center relative">
      <header className="z-[1] h-20 lg:w-[1200px]"></header>
      <section className="z-[1] mt-24">
        <h1 className="text-4xl lg:text-5xl font-bold text-center">
          쉽게 꾸미는 나만의 이미지, LumiArt
        </h1>
        <p className="lg:text-2xl text-neutral-500 text-center mt-8">
          필터, 효과, 감성까지—
          <br /> 당신의 스타일을 완성하세요.
        </p>
        <div className="flex justify-center mt-8">
          <Link
            className=" min-w-40 rounded-xl p-4 bg-[#FFE585] hover:bg-[#FBE181] text-center"
            href={"/design"}
          >
            <span className="text-gray-600 font-bold">시작하기</span>
          </Link>
        </div>
      </section>
      <img
        className="absolute w-full h-full"
        src="/images/bg_landing.png"
        alt="background"
        sizes="100vw"
      />
    </div>
  );
}
