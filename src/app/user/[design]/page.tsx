import App from "./App";
import { Room } from "./Room";

export default function Page({ params }) {
  console.log(params);

  return (
    <Room roomId={params.design}>
      <App />
    </Room>
  );
}
