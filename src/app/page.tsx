import prisma from "@/lib/prisma";
import { Images, Session } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default async function Page() {
  const { data } = useSession();
  const session = data as Session | null;
  const img: Images = (await prisma.images.findUnique({
    where: { id: session?.user?.profile_picture_id ?? -1 },
  })) ?? { raw_image: "", id: 0 };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Image src={img.raw_image} alt={"test"} width={500} height={100} />
    </div>
  );
}
