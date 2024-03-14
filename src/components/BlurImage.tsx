import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import React from "react";

type Props = {
  src: string;
  className?: string;
};
export const BlurImage: React.FC<Props> = async ({ src, className }: Props) => {
  const buffer = await fetch(src).then(async (res) => {
    return Buffer.from(await res.arrayBuffer());
  });
  const { base64 } = await getPlaiceholder(buffer);
  return (
    <div className={className}>
      <Image
        src={src}
        alt={"test"}
        fill
        sizes={"30vw"}
        placeholder="blur"
        blurDataURL={base64}
      />
    </div>
  );
};

export default BlurImage;
