export default function ga(command, second, third) {
  // gtag is a global function provided by Google Analytics
  if (gtag) {
    gtag(first, second, third);
  }
}
