import './globals.css';

export const metadata = {
  title: 'Todo List App',
  description: 'Full stack Todo App with Next.js and MongoDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
