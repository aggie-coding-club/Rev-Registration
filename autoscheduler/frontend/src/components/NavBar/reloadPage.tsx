// Seems useless but used for testing in NavBar.tsx. Do not delete
// or replace with just window.location.reload() without reading the
// related note in that file first at least. just ctrl f 'reload' to find it quickly

function reloadPage(): void {
  window.location.reload();
}

// This is written like this because the tests won't let me
// replace the function with jest.fn() otherwise
const reloadPageFunctions = {
  reloadPage,
};

export default reloadPageFunctions;
