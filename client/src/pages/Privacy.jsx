// src/pages/Privacy.jsx
import React, { Suspense } from "react";
import Loader from "../components/Loader";
import { privacyContent } from "../data/privacyData";

// Lazy load MarkdownPage
const MarkdownPage = React.lazy(() => import("../components/MarkdownPage"));

const Privacy = () => (
  <Suspense fallback={<Loader />}>
    <MarkdownPage content={privacyContent} />
  </Suspense>
);

export default Privacy;
