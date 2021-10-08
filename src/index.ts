type EvaluationResult = number | string;
type EvaluationFunction<T> = (x: T) => EvaluationResult;
type CompareFunction<T> = (a: T, b: T) => number;
type SortingFunction<T> = (sequence: T[]) => T[];

type Sorter<T> =
  | {
      type: 'desc' | 'asc';
      f: EvaluationFunction<T>;
    }
  | {
      type: 'raw';
      f: CompareFunction<T>;
    };

export const sorters = {
  asc: <T>(f: EvaluationFunction<T>): Sorter<T> => ({ type: 'asc', f }),
  desc: <T>(f: EvaluationFunction<T>): Sorter<T> => ({ type: 'desc', f }),
  raw: <T>(f: CompareFunction<T>): Sorter<T> => ({ type: 'raw', f })
}

const tacto = <T>(...sorts: Array<Sorter<T>>): SortingFunction<T> => {
  return (items) =>
    [...items].sort((a: T, b: T): number => {
      let result = 0

      for (const sort of sorts) {
        if (sort.type === 'raw') {
          result = sort.f(a, b)
        } else {
          const [v1, v2]: EvaluationResult[] = [sort.f(a), sort.f(b)]

          if (typeof v1 === 'number' && typeof v2 === 'number') {
            result = (sort.type === 'desc' ? -1 : 1) * (v1 - v2)
          } else {
            result = (sort.type === 'desc' ? -1 : 1) * v1.toString().localeCompare(v2.toString())
          }
        }

        if (result !== 0) {
          return result
        }
      }

      return result
    })
}

tacto.sorters = sorters

export const asc = tacto<EvaluationResult>(sorters.asc((x) => x))
export const desc = tacto<EvaluationResult>(sorters.desc((x) => x))

export default tacto
