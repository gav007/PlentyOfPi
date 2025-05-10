# **App Name**: Plenty of π

## Core Features:

- Sticky Navbar: Implement a top navigation bar that sticks to the top on scroll, providing a good user experience. Includes a stylized logo, horizontal links on larger screens, and a hamburger dropdown menu on mobile. Mobile Nav: Hamburger menu opens full screen or slide-out panel. Includes all nav links. Closes on click or outside tap. All buttons use semantic <button>. Nav menu is keyboard navigable and ARIA-labeled.
- Hero Section: A landing page hero section with a responsive layout, scalable image, title, subtitle, and call-to-action buttons directing users to key features such as the Binary Game and Lessons.
- Binary Game Card: Interactive card for the 8-Bit Converter Game, highlighting its educational purpose. Includes a title, description, and action button with a link to start playing. Styled using ShadCN UI with hover effects and transitions.  Icon Usage: 🧠 Game card: brain icon
- Scalable Card Grid: Responsive grid layout using Tailwind CSS for upcoming games and educational tools, with placeholder cards to maintain a consistent and scalable layout as more content is added. Includes logic for 'Coming Soon' states. Accessibility: Images have alt text.

## Style Guidelines:

- White/light background to maintain a clean and professional appearance, consistent with the SmartPrep interface.
- A soft, tech-inspired blue (#A0D2EB) to highlight interactive elements and calls to action, reinforcing the educational and tech-focused theme. Primary color: `#3B82F6` (Tailwind blue-500) or SmartPrep default
- Clean typography with the existing SmartPrep font set, ensuring readability and consistency. Font family: Inter / Sans-serif stack
- Lucide React icons to represent different sections and functionalities for intuitive navigation. Icon Usage:  🧮 Calculators: calculator icon 📘 Lessons: book icon 📂 Flashcards: archive box icon
- Responsive flex/grid layout using Tailwind CSS to ensure seamless adaptation across various screen sizes and devices. Spacing: Use Tailwind scale (e.g., `p-4`, `gap-6`)
- Subtle hover effects and scale-up animations on cards to create engaging user interactions without overwhelming the interface. Rounding: `rounded-2xl` Shadow: `shadow-lg` + `hover:shadow-xl`