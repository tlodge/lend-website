"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function BackLinkButton() {
  const router = useRouter();

  return (
    <a
      href="#"
      className={styles.backLink}
      onClick={(event) => {
        event.preventDefault();
        router.back();
      }}
    >
      Return to previous screen
    </a>
  );
}
