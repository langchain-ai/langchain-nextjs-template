"use client";

export function Image(props: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={props.src}
      alt="Image"
      className="object-cover min-w-[256px] min-h-[256px] rounded overflow-hidden flex-shrink-0"
    />
  );
}
