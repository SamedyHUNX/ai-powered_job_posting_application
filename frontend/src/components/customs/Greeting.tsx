"use client";

import { useEffect, useState } from "react";

export const Greeting = ({ userName = "there" }) => {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }
  }, []);

  return (
    <h1>
      {greeting}, {userName}! 👋
    </h1>
  );
};
