import React from "react";

import styles from "./avatar.module.css";
import Image from "next/image";
type Props = {
  name: string;
  otherStyles?: string;
};

const Avatar = ({ name, picture, otherStyles }: Props) => {
  return (
    <div
      className={`relative h-9 w-9 rounded-full ${otherStyles}`}
      data-tooltip={name}
    >
      <Image src={picture} fill className="rounded-full" alt={name} />
    </div>
  );
};

export default Avatar;
