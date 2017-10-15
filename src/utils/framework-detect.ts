export default function frameworkDetect(framework) {
  if (framework.name.indexOf('Vue') >= -1) {
    return 'Vue';
  }
  return null;
}
