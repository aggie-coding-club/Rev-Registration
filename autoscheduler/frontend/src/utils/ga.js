/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-undef */ // gtag undefined b/c it's a global function
export default function ga(command, second, third) {
  // gtag is a global function provided by Google Analytics
  if (gtag) {
    gtag(command, second, third);
  }
}
