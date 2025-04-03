import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CanvasRendererProvider } from "./_contexts/CanvasRendererContext";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});
export const metadata: Metadata = {
  title: "LumiArt",
  description:
    "LumiArt는 누구나 간단히 이미지의 분위기와 스타일을 변화시킬 수 있는 편리한 이미지 편집 서비스입니다. 다양한 필터와 효과로 사진을 예술적으로 바꿔보세요. LumiArt는 빠르고 직관적인 편집 도구를 통해 일상 이미지를 특별하게 만들어 줍니다.",
  icons: ["/logo.webp"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} font-pretendard antialiased`}>
        <CanvasRendererProvider>{children}</CanvasRendererProvider>
      </body>
    </html>
  );
}
