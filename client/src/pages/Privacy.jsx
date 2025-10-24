// src/pages/Privacy.jsx
import React, { Suspense } from "react";
import { Helmet } from "react-helmet-async"; // import Helmet
import Loader from "../components/Loader";
import { privacyContent } from "../data/privacyData";

// Lazy load MarkdownPage
const MarkdownPage = React.lazy(() => import("../components/MarkdownPage"));

const Privacy = () => (
  <>
    <Helmet>
      <title>
        Privacy Policy | RentMyCam - Camera & Accessory Rental in Bengaluru
      </title>
      <meta
        name="description"
        content="Read RentMyCam's Privacy Policy. Learn how we handle your data while renting cameras and accessories in Bengaluru."
      />
      <link rel="canonical" href="https://rentmycam.in/privacy" />
    </Helmet>

    <Suspense fallback={<Loader className="min-h-[90vh]" />}>
      <MarkdownPage content={privacyContent} />
    </Suspense>
  </>
);

export default Privacy;
