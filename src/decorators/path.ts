export default function Path(path: String) {
  return (target : any) => { target.paths[target.name] = path; };
}
