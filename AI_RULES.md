# AI Assistant Rules for Md. Wasim's Portfolio App

This document outlines the technical stack and specific guidelines for developing and modifying the portfolio application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

1.  **Frontend Framework:** The application is built using **React** with **TypeScript**, providing a robust and type-safe environment for dynamic user interfaces.
2.  **Styling:** All visual presentation and responsiveness are handled exclusively with **Tailwind CSS**, utilizing its utility-first classes.
3.  **Build Tool:** **Vite** is used as the build tool, offering a fast development server and optimized production builds.
4.  **Client-Side Data Persistence:** Data such as admin authentication status, hero image, social links, inquiries, projects, and services are persistently stored on the client-side using **`localStorage`**.
5.  **Form Handling:** The contact form submissions are managed through **Formspree**.
6.  **Icons:** **Lucide React** is integrated for all icon needs, providing a flexible and customizable set of SVG icons.
7.  **Animations:** Native browser APIs, specifically **Intersection Observer** and **Mutation Observer**, are employed for scroll-triggered animations and observing dynamic content changes.
8.  **UI Library:** The application is pre-integrated with **shadcn/ui** for a collection of accessible and customizable UI components.
9.  **Application Flow:** The main application flow and conditional rendering (e.g., public site vs. admin dashboard) are managed within `src/App.tsx`.

## Library Usage Guidelines

*   **React & TypeScript:** All new components, features, and application logic must be developed using React and TypeScript.
*   **Styling (Tailwind CSS):** Always use Tailwind CSS utility classes for all styling. Avoid creating custom CSS files or using inline styles.
*   **UI Components (shadcn/ui):** Prioritize using existing shadcn/ui components. If a component requires modification, create a new wrapper component that extends or customizes the shadcn/ui component rather than directly editing the library's source files.
*   **Icons (Lucide React):** Use icons from the `lucide-react` library for all icon requirements.
*   **Data Persistence (localStorage):** For any client-side data storage, `localStorage` is the designated mechanism. Do not introduce server-side databases or external data storage solutions unless explicitly requested and a relevant integration (e.g., Supabase) is provided.
*   **Form Submissions (Formspree):** Maintain the existing Formspree integration for handling contact form submissions.
*   **Routing:** The top-level application flow is controlled by `App.tsx`. If more granular routing is needed within specific sections (e.g., public pages, admin sub-sections), React Router should be implemented within `App.tsx` or a dedicated routing component.
*   **Component Structure:** Always create new, focused files for new components. Place general components in `src/components/` and page-specific components in `src/pages/`.
*   **Simplicity:** Strive for simple and elegant solutions. Avoid over-engineering with overly complex patterns or libraries unless the user's request explicitly demands such complexity.