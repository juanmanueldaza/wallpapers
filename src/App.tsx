import { lazy, Suspense } from "react";
const Slideshow = lazy(() => import("./components/slideshow/Slideshow"));
import { ErrorBoundary } from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Slideshow />
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
