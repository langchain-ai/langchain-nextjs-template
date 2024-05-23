import { EndpointsContext } from "./agent";
import { ReactNode } from "react";

export default function RootLayout(props: { children: ReactNode }) {
  return <EndpointsContext>{props.children}</EndpointsContext>;
}
