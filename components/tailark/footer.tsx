"use client";

import Link from "next/link";
import GetMyCV from "../GetMyCV";

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Solution",
    href: "#solution",
  },
  {
    title: "Benefits",
    href: "#benefits",
  },
  {
    title: "Get started",
    href: "#start",
  },
  {
    title: "Sign in",
    href: "/sign-in",
  },
];

export default function FooterSection() {
  return (
    <footer className="py-8 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex justify-center w-full">
          <GetMyCV />
        </div>
        {/* <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div> */}

        <span className="text-muted-foreground block text-center text-sm">
          {" "}
          © {new Date().getFullYear()} GetMyCV, All rights reserved
        </span>
      </div>
    </footer>
  );
}
