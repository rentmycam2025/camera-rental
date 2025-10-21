// src/pages/Terms.jsx
import React, { Suspense } from "react";
import Loader from "../components/Loader";
import { termsContent } from "../data/termsData";

// Lazy load MarkdownPage
const MarkdownPage = React.lazy(() => import("../components/MarkdownPage"));

const Terms = () => (
  <Suspense fallback={<Loader />}>
    <MarkdownPage content={termsContent} />
  </Suspense>
);

export default Terms;
