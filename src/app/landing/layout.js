"use client";
import React from "react";
import Header from './header';

export default function RootLayout({ children }) {

    return (
      <>
          <Header />
          <>
            {children}
          </>
      </>
    );
  }
  