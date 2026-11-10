// A real screen from the NPS prototype (rendered to /public/work/nps) inside a
// flat iPhone frame. See IPhone for how the images are cropped.
import { IPhone } from "./IPhone";

export function Shot(props: { src: string; alt: string; width?: number; className?: string; priority?: boolean }) {
  return <IPhone {...props} />;
}
