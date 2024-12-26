import { lazy, Suspense } from "react";
const Slideshow = lazy(() => import("./components/slideshow/Slideshow"));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Slideshow />
    </Suspense>
  );
};

export default App;
