"use client";
import { Session } from "@/types";
import { Session as Sess } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

type Props = {
  session: Sess | null;
};
const NavBar = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const session = props.session as unknown as Session;
  const NavBarResponsiveMenu = () => {
    if (isOpen) {
      // center div
      return "flex flex-col justify-evenly bg-blue-500 absolute w-screen h-screen z-2 right-[0%] top-[0%] items-center";
    }
    return "flex flex-row justify-between w-1/2 items-center mmd:hidden";
  };

  const NavBarResponsiveProfile = () => {
    if (isOpen) {
      // center div
      return "cursor-pointer aspect-[4/4] object-cover left-2 top-2 absolute w-14";
    }
    return "cursor-pointer aspect-[4/4] object-cover relative w-14";
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsOpen(false);
    });
  }, []);

  return (
    <div className="flex w-screen justify-between bg-blue-500  p-5 items-center">
      <div>
        <h1 className="font-bold text-4xl ">TaskHub Logo</h1>
      </div>
      <div className={NavBarResponsiveMenu()}>
        <div>Accueil</div>
        <div>Menu</div>
        <div>Menu</div>
        {session?.user ? (
          <Link
            href={`/u/${session.user.id}`}
            className={NavBarResponsiveProfile()}
          >
            <Image
              src={session.user?.image_url}
              alt={"user image"}
              sizes={"10vw"}
              className="rounded-[10vw]"
              fill
            />
          </Link>
        ) : (
          <div className="bg-[#02394A] rounded-xl p-2">Se connecter</div>
        )}
      </div>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="md:hidden flex items-center z-0"
      >
        <Image src={"/menu.svg"} alt={"test"} width={"50"} height={"50"} />
      </div>
    </div>
  );
};

export default NavBar;
