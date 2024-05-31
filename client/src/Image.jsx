export default function Image({src,...rest}) {
    src = src && src.includes('https://')
      ? src
      : `${process.env.REACT_APP_API_URL}/`+src;
    return (
      <img {...rest} src={src} alt={''} />
    );
  }