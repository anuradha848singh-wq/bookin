"use client";

import React from "react";
import Link from "next/link";
import { Logo, Chev, Arr } from "./Icons";

export const Navbar = () => (
  <nav className="bk-nav">
    <Link href="/" style={{ textDecoration: "none" }}>
      <Logo />
    </Link>
    <div className="bk-nav-links">
      <Link href="/product" className="bk-nav-link">Product <Chev /></Link>
      <Link href="/solutions" className="bk-nav-link">Solutions <Chev /></Link>
      <Link href="/resources" className="bk-nav-link">Resources <Chev /></Link>
      <Link href="/pricing" className="bk-nav-link">Pricing</Link>
      <Link href="/company" className="bk-nav-link">Company <Chev /></Link>
    </div>
    <div className="bk-nav-right">
      <a href={process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/login` : "http://localhost:3002/login"} className="bk-btn-ghost">Sign in</a>
      <a href={process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/login` : "http://localhost:3002/login"} className="bk-btn-red">Try Bookin Free <Arr /></a>
    </div>
  </nav>
);
