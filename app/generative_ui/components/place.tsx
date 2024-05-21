"use client";

import { LocalContext } from "@/app/generative_ui/shared";
import { useContext } from "react";

export function Place(props: {
  place: {
    title: string;
    description: string;
    price: string;
  };
}) {
  const onSearch = useContext(LocalContext);

  return (
    <button
      type="button"
      className="cursor-pointer flex flex-col items-start border border-gray-500 p-4 rounded-md hover:bg-gray-700/50 active:bg-gray-700 transition-colors text-left"
      onClick={() => {
        onSearch(`Show me pictures of ${props.place.title}`);
      }}
    >
      <div className="font-bold">{props.place.title}</div>
      <div>{props.place.description}</div>
      <div>{props.place.price}</div>
    </button>
  );
}
