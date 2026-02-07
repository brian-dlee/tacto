import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import tacto from 'tacto';

interface RGB {
  red: number;
  green: number;
  blue: number;
}

interface Person {
  name: string;
  birthday: string;
  country: string;
  favoriteColor: RGB;
}

function zp(input: string, length: number): string {
  return `${'0'.repeat(Math.max(length - input.length, 0))}${input}`;
}

function rgbToHex(rgb: RGB): string {
  const { red, green, blue } = rgb;
  const r = zp(red.toString(16), 2);
  const g = zp(green.toString(16), 2);
  const b = zp(blue.toString(16), 2);
  return `${r}${g}${b}`;
}

function rgbToLightness(rgb: RGB): number {
  return Math.round((rgb.red + rgb.green + rgb.blue) / 3);
}

// To demonstrate the flexibilty of tacto, we will always make people who live in countries
// with an even number of characters rank first. After that, we'll sort them by country name length.
function comparePersonCountry(a: Person, b: Person): number {
  if (a.country.length % 2 === 0 && b.country.length % 2 === 0) {
    return a.country.length - b.country.length;
  }

  return a.country.length % 2 == 0 ? -1 : 1;
}

const sorter = tacto<Person>(
  // demonstrate a custom evaluator, sort favorite colors from lightest to darkest
  tacto.sorters.asc(({ favoriteColor }) => rgbToLightness(favoriteColor)),
  // Dates are handled natively
  tacto.sorters.asc(({ birthday }) => new Date(birthday)),
  // include our obscure compare function
  tacto.sorters.raw(comparePersonCountry),
  // name is our tie-breaker
  tacto.sorters.asc(({ name }) => name),
);

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch('https://lorem-json.com/api/json', {
    method: 'POST',
    body: JSON.stringify({
      people: {
        count: 300,
        type: 'array',
        items: {
          name: '{{name()}}',
          birthday: '{{dateTime(1920-01-01, 1971-01-01)}}',
          favoriteColor: {
            red: '{{int(0, 256)}}',
            green: '{{int(0, 256)}}',
            blue: '{{int(0, 256)}}',
          },
          country: '{{country()}}',
        },
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: { people: Person[] } = await response.json();

  return { people: sorter(data.people) };
}

export default function Index() {
  const { people } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Tacto Demo</h1>
      <p>
        The sorter in this page takes a list of <code>Person</code> objects. Each person contains:
        <ul>
          <li>
            <code>name (string)</code>
          </li>
          <li>
            <code>birthday (Date)</code>
          </li>
          <li>
            <code>country (string)</code>
          </li>
          <li>
            <code>favoriteColor (&#123; red: number, green: number, blue: number &#125;)</code>
          </li>
        </ul>
      </p>
      <p>
        The sorter first sorts each <code>Person</code> by their favorite color according to how light/dark the color is,
        then they are sorted chronologically by their birthdays, next they are sorted by a custom comparison function that
        evaluates the name of the country, and lastly alphabetically by their name. The sort is not very practical, but it
        shows the flexibility of the library. Below is what the main sorter composition looks like.
      </p>
      <p>
        <pre>
          <code>
            {`
const sorter = tacto<Person>(
  tacto.sorters.asc(({ favoriteColor }) => rgbToLightness(favoriteColor)),
  tacto.sorters.asc(({ birthday }) => new Date(birthday)),
  tacto.sorters.raw(comparePersonCountry),
  tacto.sorters.asc(({ name }) => name)
);`.trim()}
          </code>
        </pre>
      </p>
      <hr />
      <ul>
        {people.map((person, i) => {
          const birthday = new Date(person.birthday).toLocaleDateString();
          const color = `#${rgbToHex(person.favoriteColor)}`;
          const background = `${rgbToLightness(person.favoriteColor) < 128 ? 'white' : 'black'}`;
          return (
            <li key={i}>
              {person.name}, <span style={{ color, background }}>Favorite Color {color}</span>, from {person.country},
              born on {birthday}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
