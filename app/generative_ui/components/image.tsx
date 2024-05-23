"use client";

export function Image(props: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={props.src}
      alt="Image"
      className="object-cover w-[256px] h-[180px] rounded overflow-hidden flex-shrink-0"
    />
  );
}

export function Images(props: { images: string[] }) {
  return (
    <div className="flex gap-2">
      {props.images.map((image, idx) => (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image key={idx} src={image} />
      ))}
    </div>
  );
}
