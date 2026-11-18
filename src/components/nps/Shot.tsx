// A real screen from the NPS prototype (rendered to /public/work/nps) inside a
// flat iPhone frame. See IPhone for how the images are cropped.
import { FeesToggle } from "./FeesToggle";
import { IPhone } from "./IPhone";

export function Shot(props: { src: string; alt: string; width?: number; className?: string; priority?: boolean }) {
  // The review screen keeps its working "View tax & charges" row.
  if (props.src !== "byReview") return <IPhone {...props} />;
  const { width, className = "", ...rest } = props;
  return (
    <div className={className} style={width ? { width } : undefined}>
      <IPhone {...rest} over={<FeesToggle />} />
      <p className="mt-2.5 text-center text-xs text-muted">Tap “View tax &amp; charges”</p>
    </div>
  );
}
