export type Params = Record<string, string>;

export interface RouteMatch<T> {
  value: T;
  params: Params;
}

interface ParamEdge<T> {
  name: string;
  node: RouteNode<T>;
}

interface WildcardEdge<T> {
  name: string;
  node: RouteNode<T>;
}

class RouteNode<T> {
  readonly staticChildren = new Map<string, RouteNode<T>>();
  paramChild?: ParamEdge<T>;
  wildcardChild?: WildcardEdge<T>;
  value?: T;
}

export class RadixRouter<T> {
  #root = new RouteNode<T>();
  #staticRoutes = new Map<string, T>();

  add(path: string, value: T): void {
    const normalizedPath = normalizePath(path);
    const segments = splitPath(normalizedPath);

    if (isStaticPath(segments)) {
      this.#staticRoutes.set(normalizedPath, value);
      return;
    }

    let current = this.#root;

    for (const segment of segments) {
      if (segment.startsWith(":")) {
        current = getParamChild(current, segment.slice(1));
        continue;
      }

      if (segment.startsWith("*")) {
        current = getWildcardChild(current, segment.slice(1));
        break;
      }

      let child = current.staticChildren.get(segment);
      if (!child) {
        child = new RouteNode<T>();
        current.staticChildren.set(segment, child);
      }
      current = child;
    }

    current.value = value;
  }

  match(path: string): RouteMatch<T> | undefined {
    const normalizedPath = normalizePath(path);
    const staticValue = this.#staticRoutes.get(normalizedPath);

    if (staticValue !== undefined) {
      return {
        value: staticValue,
        params: {},
      };
    }

    const segments = splitPath(normalizedPath);
    return matchNode(this.#root, segments, 0, {});
  }
}

function matchNode<T>(
  node: RouteNode<T>,
  segments: string[],
  index: number,
  params: Params,
): RouteMatch<T> | undefined {
  if (index === segments.length) {
    if (node.value === undefined) return undefined;

    return {
      value: node.value,
      params,
    };
  }

  const segment = segments[index];
  const staticChild = node.staticChildren.get(segment);

  if (staticChild) {
    const match = matchNode(staticChild, segments, index + 1, params);
    if (match) return match;
  }

  if (node.paramChild) {
    const paramParams = {
      ...params,
      [node.paramChild.name]: decodeURIComponent(segment),
    };
    const match = matchNode(
      node.paramChild.node,
      segments,
      index + 1,
      paramParams,
    );
    if (match) return match;
  }

  if (node.wildcardChild) {
    const wildcardParams = {
      ...params,
      [node.wildcardChild.name]: decodeURIComponent(
        segments.slice(index).join("/"),
      ),
    };

    if (node.wildcardChild.node.value !== undefined) {
      return {
        value: node.wildcardChild.node.value,
        params: wildcardParams,
      };
    }
  }

  return undefined;
}

function getParamChild<T>(node: RouteNode<T>, name: string): RouteNode<T> {
  if (!name) {
    throw new TypeError("Param route segment must include a name.");
  }

  if (node.paramChild && node.paramChild.name !== name) {
    throw new TypeError(
      `Param route conflict: ":${node.paramChild.name}" already exists at this level.`,
    );
  }

  if (!node.paramChild) {
    node.paramChild = {
      name,
      node: new RouteNode<T>(),
    };
  }

  return node.paramChild.node;
}

function getWildcardChild<T>(node: RouteNode<T>, name: string): RouteNode<T> {
  if (!name) {
    throw new TypeError("Wildcard route segment must include a name.");
  }

  if (node.wildcardChild && node.wildcardChild.name !== name) {
    throw new TypeError(
      `Wildcard route conflict: "*${node.wildcardChild.name}" already exists at this level.`,
    );
  }

  if (!node.wildcardChild) {
    node.wildcardChild = {
      name,
      node: new RouteNode<T>(),
    };
  }

  return node.wildcardChild.node;
}

function isStaticPath(segments: string[]): boolean {
  return segments.every((segment) =>
    !segment.startsWith(":") && !segment.startsWith("*")
  );
}

function normalizePath(path: string): string {
  if (!path.startsWith("/")) {
    throw new TypeError(`Route path must start with "/": ${path}`);
  }

  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

function splitPath(path: string): string[] {
  if (path === "/") return [];
  return path.slice(1).split("/");
}
