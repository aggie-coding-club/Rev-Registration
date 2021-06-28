import * as html2canvas from 'html2canvas'; // This import is incorrect, so we made this a JS file
import saveImage from './saveImage';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function execute2canvas(options, scheduleRef) {
  html2canvas(scheduleRef.current, options).then(
    (canvas) => {
      saveImage(canvas.toDataURL(), 'schedule.png');
    },
  );
}
