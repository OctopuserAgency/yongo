export default function State(state = {}) {
  return (target) => {
    target.prototype.state = state;
  };
}
