import { useState, useMemo } from 'react';
import useResize from './useResize';

const UP = '+';
const DOWN = '-';
const LANDSCAPE = '-';
const PORTRAIT = '|';

interface IOptions {
  breakpoints: {
    [key: string]: number[];
  };
}

let options: IOptions;

interface GeneralScreen extends Screen {
  mozOrientation: OrientationType;
  msOrientation: OrientationType;
}

const isLandscape = (): boolean => {
  const s = window.screen as GeneralScreen;
  const orientation: OrientationType =
    s.msOrientation ||
    s.mozOrientation ||
    (s.orientation || { type: 'portrait-primary' }).type;
  return orientation && orientation.includes('landscape');
};

const cachedProplessValue = {};

const calculateProplessValue = (iw: number): { [key: string]: boolean } => {
  if (cachedProplessValue[iw]) return cachedProplessValue[iw];

  const isLands = isLandscape();

  const proplessValue = {
    isLandscape: isLands,
    isPortrait: !isLands,
    isHDPI: window.devicePixelRatio > 1,
  };

  const { breakpoints } = options;

  return Object.entries(breakpoints)
    .map((entry): [string, boolean] => {
      const [key, value] = entry;
      const [from, to] = value;
      return [key, iw > from && iw <= to];
    })
    .map((entry): [string, boolean] => {
      const [key, value] = entry;
      const [fl, sl, ...rest] = key;
      if (LANDSCAPE === fl || PORTRAIT === sl) {
        return [`${fl}${sl.toUpperCase()}${rest.join()}`, value];
      } else {
        return [`${fl.toUpperCase()}${sl}${rest.join()}`, value];
      }
    })
    .reduce((acc, entry) => {
      const [key, value] = entry;
      return { ...acc, [key]: value };
    }, proplessValue);
};

type TCalcDefResult = { [key: string]: boolean };

type FCalculateValue$1 = () => TCalcDefResult;
type FCalculateValue$2 = <T>(dv: T) => T;
type FCalculateValue$3 = <T>(dv: T, bv: Array<[string, T]>) => T;

type FCalculateValue =
  | FCalculateValue$1
  | FCalculateValue$2
  | FCalculateValue$3;

export const calculateValue: FCalculateValue = function<T>(
  defaultValue?: T,
  breakpointValues?: Array<[string, T]>
) {
  const hasBreakpointValues: boolean =
    Array.isArray(breakpointValues) && breakpointValues.length > 0;
  const hasDefaultValue: boolean = defaultValue !== undefined;
  const iw = window.innerWidth;

  if (!hasDefaultValue && !hasBreakpointValues) {
    return calculateProplessValue(iw);
  }

  if (!hasBreakpointValues) {
    return defaultValue;
  }

  const isLands = isLandscape();

  for (const [key, value] of breakpointValues) {
    if (!options.breakpoints[key]) continue;
    const [from, to] = options.breakpoints[key];
    if (isLands && key.startsWith(PORTRAIT)) continue;
    if (!isLands && key.startsWith(LANDSCAPE)) continue;
    if (iw > from && iw <= to) return value;
  }

  return defaultValue;
};

export const useBreakpoint = function<T>(defaultValue?: T, breakpointValues?: Array<[string, T]>) {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useResize(() => setInnerWidth(window.innerWidth));
  
  return useMemo<TCalcDefResult | T>(
    (): TCalcDefResult | T => calculateValue(defaultValue, breakpointValues),
    [innerWidth, defaultValue]
  );
};

export const setup = function(opts: IOptions) {
  Object.entries(opts.breakpoints).forEach(([name, [from, to]]) => {
    // eslint-disable-next-line
    [
      ['', [from, to]],
      [UP, [from, 10000]],
      [DOWN, [0, to]],
    ].forEach(([symbol, fromTo]) =>
      ['', LANDSCAPE, PORTRAIT].forEach(orientation => {
        // eslint-disable-next-line
        opts.breakpoints[`${orientation}${name}${symbol}`] = fromTo as [
          number,
          number
        ];
      })
    );
  });

  options = opts;
};

export const breakpoints = {
  micro: [0, 375],
  mobile: [376, 639],
  tablet: [640, 1023],
  small: [1024, 1439],
  medium: [1440, 1919],
  large: [1920, 10000],
};

setup({ breakpoints });

export default useBreakpoint;
