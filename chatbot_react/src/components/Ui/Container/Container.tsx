import type { ReactNode } from "react";
import "./Container.scss";

interface Props {
  children?: ReactNode;
  content?: boolean;
}

export function Container({ children, content = true }: Props) {
  return (
    <section className="container">
      {content ? (
        children || " "
      ) : (
        <div className="container__content">{children || " "}</div>
      )}
    </section>
  );
}
