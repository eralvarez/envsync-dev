type Navigation =
  | {
      action?: React.ReactNode;
      children?: Array<
        object | { kind: "header"; title: string } | { kind: "divider" }
      >;
      icon?: React.ReactNode;
      kind?: "page";
      pattern?: string;
      segment?: string;
      title?: string;
    }
  | { kind: "header"; title: string }
  | { kind: "divider" };

export type { Navigation };
