import type { SVGProps } from 'react';

export function Google(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M21.8 10.5c0-.7-.1-1.4-.2-2.1h-9.1v4h5.2c-.2 1.3-1 2.4-2.1 3.2v2.7h3.5c2-1.9 3.2-4.7 3.2-7.8z"
      ></path>
      <path
        fill="currentColor"
        d="M12.5 22c2.7 0 4.9-1 6.5-2.7l-3.5-2.7c-.9.6-2.1.9-3 .9-2.3 0-4.3-1.6-5-3.8H4v2.8C5.8 20 8.9 22 12.5 22z"
      ></path>
      <path fill="currentColor" d="M7.5 14.2c-.2-.6-.2-1.2-.2-1.8s0-1.2.2-1.8V7.9H4C3.2 9.6 2.7 11.5 2.7 13.5s.5 3.9 1.3 5.6l3.5-2.9z"></path>
      <path fill="currentColor" d="M12.5 5.8c1.5 0 2.8.5 3.8 1.5l3.1-3.1C17.4 2.2 15.2 1 12.5 1 8.9 1 5.8 3 4 5.9l3.5 2.7c.7-2.2 2.7-3.8 5-3.8z"></path>
    </svg>
  );
}

export function Microsoft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M11.4 21.9H2.1V12.6h9.3zm0-11.4H2.1V2.1h9.3zM21.9 21.9h-9.3V12.6h9.3zm0-11.4h-9.3V2.1h9.3z"></path>
    </svg>
  );
}
