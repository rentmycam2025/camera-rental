// src/pages/Terms.jsx
import React, { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Loader from "../components/Loader";
import { termsContent } from "../data/termsData";

// Lazy load MarkdownPage
const MarkdownPage = React.lazy(() => import("../components/MarkdownPage"));

const Terms = () => (
  <>
    <Helmet>
      <title>
        Terms of Service | RentMyCam - Camera & Accessory Rental in Bengaluru
      </title>
      <meta
        name="description"
        content="Read RentMyCam's Terms of Service. Understand our policies and guidelines for renting cameras and accessories in Bengaluru."
      />
      <link rel="canonical" href="https://rentmycam.in/terms" />
    </Helmet>

    <Suspense fallback={<Loader />}>
      <MarkdownPage content={termsContent} />
    </Suspense>
  </>
);

export default Terms;
