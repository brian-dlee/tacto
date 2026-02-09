import type { MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

export const meta: MetaFunction = () => [
  { charset: 'utf-8' },
  { title: 'Tacto Demo' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
