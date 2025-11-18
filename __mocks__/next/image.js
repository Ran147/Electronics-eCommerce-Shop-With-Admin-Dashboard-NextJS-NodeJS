// __mocks__/next/image.js
export default function Image({ src, alt, ...props }) {
  return <img src={src} alt={alt} {...props} />;
}
