import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { RouteFallback } from '@/components/RouteFallback';
import Home from '@/pages/Home';

/**
 * Routing.
 *
 * Home is imported eagerly — it is the most common entry point, and code-
 * splitting it would only add a round trip to the first paint. Every other
 * route is lazy, so a visitor who lands on the home page never downloads the
 * case studies or the contact form.
 */
const About = lazy(() => import('@/pages/About'));
const WhatIDo = lazy(() => import('@/pages/WhatIDo'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Experience = lazy(() => import('@/pages/Experience'));
const Services = lazy(() => import('@/pages/Services'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route
          path="about"
          element={
            <Suspense fallback={<RouteFallback />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="what-i-do"
          element={
            <Suspense fallback={<RouteFallback />}>
              <WhatIDo />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Projects />
            </Suspense>
          }
        />
        <Route
          path="projects/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route
          path="experience"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Experience />
            </Suspense>
          }
        />
        <Route
          path="services"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Services />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
