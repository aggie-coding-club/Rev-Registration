/**
 * Given a data URL of an object, saves it as the given filename and displays the save as download
 * prompt.
 * @param url The (data) URL of the object to save
 * @param filename The name of the file to save
 */
export default function saveDataURL(url: string, filename: string): void {
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.style.display = 'none';

  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
  link.remove();
}
